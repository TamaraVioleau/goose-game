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

  async function fetchQuestion() {
    const catRef = collection(db, "categories");
    const catSnap = await getDocs(catRef);
    if (catSnap.empty) {
      currentQuestion = "Aucune catégorie trouvée.";
      return;
    }
    const firstCat = catSnap.docs[0];
    const qRef = collection(db, "categories", firstCat.id, "questions");
    const qSnap = await getDocs(qRef);
    if (qSnap.empty) {
      currentQuestion = "Aucune question disponible.";
      return;
    }
    const questionDoc = qSnap.docs[0];
    currentQuestion =
      questionDoc.get("text") ?? questionDoc.get("question") ?? "";
  }

  async function handleRoll(event: { detail: { total: number } }) {
    if (gameOver) return;
    turns += 1;
    position = Math.min(position + event.detail.total, board.length - 1);
    message = `Tour ${turns}/10`;
    await fetchQuestion();
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
