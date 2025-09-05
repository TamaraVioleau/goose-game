<script lang="ts">
  import { onMount } from "svelte";
  import { db } from "$lib/firebaseClient";
  import { collection, getDocs, doc, getDoc } from "firebase/firestore";
  import GameBoard from "../components/GameBoard.svelte";
  import DiceRoller from "../components/DiceRoller.svelte";
  import QuestionModal, { type QuestionData } from "../components/QuestionModal.svelte";
  import { generateGooseBoard } from "$lib/logic/generateGooseBoard";

  const board = generateGooseBoard();

  let position = 0;
  let turns = 0;
  let score = 0;
  let gameOver = false;
  let message = "";
  let showQuestion = false;
  let currentQuestion: QuestionData | null = null;
  let canRoll = false;
  let awaitingNextTurn = false;
  let questionStartTime = 0;
  // Etat de finale (case finale)
  let finalPhase = false;
  let finalCategoriesRemaining: string[] = [];
  let currentCategoryKey: string | null = null;
  // En finale: enchaîner immédiatement la prochaine catégorie sans consommer de tour
  let finalContinue = false;
  // Eviter de répéter deux fois de suite la même question par catégorie
  let lastQuestionIdByCategory: Record<string, string | undefined> = {};

  onMount(async () => {
    try {
      const ref = collection(db, "categories");
      const snapshot = await getDocs(ref);
      console.log("Categories:", snapshot.docs.map((doc) => doc.id));
    } catch (e) {
      console.warn("Impossible de charger les catégories (debug)", e);
    }
    startTurn();
  });

  const colorCategoryMap: Record<string, string> = {
    "#EF4444": "hygiene",
    "#6B21A8": "securite",
    "#3B82F6": "accessibilite",
    "#F59E0B": "accueil_client",
    "#10B981": "allergenes",
  };

  async function fetchQuestion(color: string) {
    const categoryKey = colorCategoryMap[color];
    if (!categoryKey) {
      currentQuestion = null;
      return;
    }

    let categoryName = categoryKey;
    try {
      const catRef = doc(db, "categories", categoryKey);
      const catSnap = await getDoc(catRef);
      if (catSnap.exists()) {
        categoryName = catSnap.get("nom") ?? categoryKey;
      }
    } catch (e) {}

    const qRef = collection(db, "categories", categoryKey, "questions");
    const qSnap = await getDocs(qRef);
    if (qSnap.empty) {
      currentQuestion = null;
      return;
    }
    const docs = qSnap.docs;
    let randomDoc = docs[Math.floor(Math.random() * docs.length)];
    const lastId = lastQuestionIdByCategory[categoryKey];
    if (docs.length > 1 && randomDoc.id === lastId) {
      const alternatives = docs.filter((d) => d.id !== lastId);
      randomDoc = alternatives[Math.floor(Math.random() * alternatives.length)];
    }
    lastQuestionIdByCategory[categoryKey] = randomDoc.id;

    currentQuestion = {
      category: categoryName,
      question: randomDoc.get("question") ?? randomDoc.get("text") ?? "",
      choices: randomDoc.get("choices") ?? [],
      answer: randomDoc.get("answer") ?? "",
      explanation: randomDoc.get("explanation") ?? "",
    } as QuestionData;
  }

  // Variante: récupérer une question directement par clé de catégorie
  async function fetchQuestionByCategoryKey(categoryKey?: string) {
    if (!categoryKey) {
      currentQuestion = null;
      return;
    }

    let categoryName = categoryKey;
    try {
      const catRef = doc(db, "categories", categoryKey);
      const catSnap = await getDoc(catRef);
      if (catSnap.exists()) {
        categoryName = catSnap.get("nom") ?? categoryKey;
      }
    } catch (e) {}

    const qRef = collection(db, "categories", categoryKey, "questions");
    const qSnap = await getDocs(qRef);
    if (qSnap.empty) {
      currentQuestion = null;
      return;
    }
    const docs = qSnap.docs;
    let randomDoc = docs[Math.floor(Math.random() * docs.length)];
    const lastId = lastQuestionIdByCategory[categoryKey];
    if (docs.length > 1 && randomDoc.id === lastId) {
      const alternatives = docs.filter((d) => d.id !== lastId);
      randomDoc = alternatives[Math.floor(Math.random() * alternatives.length)];
    }
    lastQuestionIdByCategory[categoryKey] = randomDoc.id;

    currentQuestion = {
      category: categoryName,
      question: randomDoc.get("question") ?? randomDoc.get("text") ?? "",
      choices: randomDoc.get("choices") ?? [],
      answer: randomDoc.get("answer") ?? "",
      explanation: randomDoc.get("explanation") ?? "",
    } as QuestionData;
  }

  async function startTurn() {
    if (gameOver) return;
    if (turns >= 15) {
      gameOver = true;
      message = "15 tours écoulés. Défaite.";
      return;
    }
    turns += 1;
    if (position === board.length - 1) {
      finalPhase = true;
    }
    if (finalPhase) {
      if (finalCategoriesRemaining.length === 0) {
        finalCategoriesRemaining = [
          "hygiene",
          "securite",
          "accessibilite",
          "accueil_client",
          "allergenes",
        ];
      }
      currentCategoryKey = finalCategoriesRemaining[0];
      message = `Finale – ${finalCategoriesRemaining.length} cat. restantes | Tour ${turns}/15`;
      await fetchQuestionByCategoryKey(currentCategoryKey);
    } else {
      message = `Tour ${turns}/15`;
      await fetchQuestion(board[position].color);
    }
    questionStartTime = Date.now();
    showQuestion = true;
  }

  async function askBonusQuestion() {
    if (gameOver) return;
    await fetchQuestion(board[position].color);
    questionStartTime = Date.now();
    showQuestion = true;
  }

  function handleAnswer(event: CustomEvent<{ correct: boolean }>) {
    const elapsed = Date.now() - questionStartTime;
    if (event.detail.correct) {
      const base = 10;
      const speedBonus = Math.max(0, 5 - Math.floor(elapsed / 1000));
      score += base + speedBonus;
      if (!finalPhase) {
        canRoll = true;
      } else {
        // Finale: valider la catégorie en cours
        if (currentCategoryKey) {
          finalCategoriesRemaining = finalCategoriesRemaining.filter((c) => c !== currentCategoryKey);
        }
        if (finalCategoriesRemaining.length === 0) {
          gameOver = true;
          message = "Finale réussie ! Victoire.";
          score += (15 - turns) * 5;
        } else {
          // Enchaîner immédiatement la prochaine catégorie sans consommer de tour
          finalContinue = true;
        }
      }
      awaitingNextTurn = false;
    } else {
      if (finalPhase) {
        // En finale: une erreur fait perdre un tour (le prochain startTurn comptera un tour)
      }
      awaitingNextTurn = true;
    }
  }

  async function handleClose() {
    showQuestion = false;
    if (gameOver) return;
    if (finalPhase && finalContinue) {
      finalContinue = false;
      currentCategoryKey = finalCategoriesRemaining[0];
      message = `Finale – ${finalCategoriesRemaining.length} cat. restantes | Tour ${turns}/15`;
      await fetchQuestionByCategoryKey(currentCategoryKey);
      questionStartTime = Date.now();
      showQuestion = true;
      return;
    }
    if (awaitingNextTurn) {
      awaitingNextTurn = false;
      startTurn();
    }
  }

  async function handleRoll(event: { detail: { total: number } }) {
    if (gameOver) return;
    canRoll = false;
    position = Math.min(position + event.detail.total, board.length - 1);
    // Si on atteint la case finale, on passe en finale
    if (position === board.length - 1) {
      finalPhase = true;
      await startTurn();
      return;
    }
    // Appliquer l’effet de la case d’arrivée
    // Déterminer les cases spéciales via l'index (évite les soucis d'encodage)
    let idx = board[position].id; // 0-based
    // Case événement: avance ou recule de 2
    if (idx % 11 === 0) {
      const move = Math.random() < 0.5 ? -2 : 2;
      position = Math.min(Math.max(position + move, 0), board.length - 1);
      idx = board[position].id;
    }
    // Case double dés: nouvelle question, si correcte -> relance immédiate
    if (idx % 7 === 0) {
      await askBonusQuestion();
    } else {
      startTurn();
    }
  }
</script>

<h1>Goose Game</h1>

<GameBoard currentPosition={position} />
<p>{message}</p>
<p>Score : {score}</p>
{#if !gameOver && canRoll}
  <DiceRoller on:rolled={handleRoll} />
{/if}
<QuestionModal
  visible={showQuestion}
  questionData={currentQuestion}
  on:answered={handleAnswer}
  on:close={handleClose}
/>

<style>
  h1 {
    color: #4a90e2;
    font-size: 2em;
    text-align: center;
  }

  p {
    font-size: 1.2em;
    text-align: center;
    margin-top: 20px;
  }
</style>

