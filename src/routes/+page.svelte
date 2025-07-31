<script lang="ts">
  import { onMount } from "svelte";
  import { db } from "$lib/firebaseClient";
  import { collection, getDocs } from "firebase/firestore";
  import GameBoard from "../components/GameBoard.svelte";
  import DiceRoller from "../components/DiceRoller.svelte";
  import QuestionModal from "../components/QuestionModal.svelte";
  import { generateGooseBoard } from "$lib/logic/generateGooseBoard";

  let position = 0;
  let turns = 0;
  let gameOver = false;
  let message = "";
  let showQuestion = false;
  let currentQuestion = "";
  const board = generateGooseBoard();

  onMount(async () => {
    const ref = collection(db, "categories");
    const snapshot = await getDocs(ref);
    console.log(
      "Categories:",
      snapshot.docs.map((doc) => doc.id)
    );
  });

  const colorCategoryMap: Record<string, string> = {
    "#EF4444": "hygiene", // rouge -> catégorie 1
    "#6B21A8": "securite", // violet -> catégorie 2
    "#3B82F6": "accessibilite", // bleu -> catégorie 3
    "#F59E0B": "accueil_client", // jaune -> catégorie 4
    "#10B981": "allergenes", // vert -> catégorie 5
  };

  async function fetchQuestion(color: string) {
    const categoryKey = colorCategoryMap[color];
    if (!categoryKey) {
      currentQuestion = "Catégorie inconnue.";
      return;
    }
    const qRef = collection(db, "categories", categoryKey, "questions");
    const qSnap = await getDocs(qRef);
    if (qSnap.empty) {
      currentQuestion = "Aucune question disponible.";
      return;
    }
    const docs = qSnap.docs;
    const randomDoc = docs[Math.floor(Math.random() * docs.length)];
    currentQuestion =
      randomDoc.get("text") ?? randomDoc.get("question") ?? "";
  }

  async function handleRoll(event: { detail: { total: number } }) {
    if (gameOver) return;
    turns += 1;
    position = Math.min(position + event.detail.total, board.length - 1);
    message = `Tour ${turns}/10`;
    const color = board[position].color;
    await fetchQuestion(color);
    showQuestion = true;
    if (turns >= 10) {
      gameOver = true;
      message = "10 tours écoulés. Vous avez perdu !";
    }
  }
</script>

<h1>Goose Game 🧩</h1>

<p>
  Welcome to the Goose Game! This is a fun and interactive game where you can
  explore different categories and play with friends.
</p>
<p>Check the console for the list of categories loaded from Firebase.</p>

<GameBoard currentPosition={position} />
<p>{message}</p>
{#if !gameOver}
  <DiceRoller on:rolled={handleRoll} />
{/if}
<QuestionModal
  visible={showQuestion}
  question={currentQuestion}
  on:close={() => (showQuestion = false)}
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
