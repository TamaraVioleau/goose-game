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
  let consecutive = 0;
  let gameOver = false;
  let message = "";
  let showQuestion = false;
  let currentQuestion: QuestionData | null = null;
  let canRoll = false;
  let awaitingNextTurn = false;
  let questionStartTime = 0;

  onMount(async () => {
    const ref = collection(db, "categories");
    const snapshot = await getDocs(ref);
    console.log("Categories:", snapshot.docs.map((doc) => doc.id));
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
    const randomDoc = docs[Math.floor(Math.random() * docs.length)];

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
      message = "15 tours écoulés. Vous avez perdu !";
      return;
    }
    turns += 1;
    message = `Tour ${turns}/15`;
    await fetchQuestion(board[position].color);
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
      consecutive += 1;
      if (consecutive >= 5) {
        gameOver = true;
        message = "Grand Chelem !";
        score += (15 - turns) * 5;
      } else {
        canRoll = true;
      }
      awaitingNextTurn = false;
    } else {
      consecutive = 0;
      awaitingNextTurn = true;
    }
  }

  function handleClose() {
    showQuestion = false;
    if (awaitingNextTurn && !gameOver) {
      awaitingNextTurn = false;
      startTurn();
    }
  }

  async function handleRoll(event: { detail: { total: number } }) {
    if (gameOver) return;
    canRoll = false;
    position = Math.min(position + event.detail.total, board.length - 1);
    let icon = board[position].icon;
    if (icon === "⛈️") {
      const move = Math.random() < 0.5 ? -2 : 2;
      position = Math.min(Math.max(position + move, 0), board.length - 1);
      icon = board[position].icon;
    }
    if (icon === "🎲") {
      await askBonusQuestion();
    } else {
      startTurn();
    }
  }
</script>

<h1>Goose Game 🧩</h1>

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

