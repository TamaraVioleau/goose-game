<script lang="ts">
  import { onMount } from "svelte";
  import { db } from "$lib/firebase";
  import { collection, getDocs } from "firebase/firestore";

  onMount(async () => {
    const ref = collection(db, "categories");
    const snapshot = await getDocs(ref);
    console.log(
      "Categories:",
      snapshot.docs.map((doc) => doc.id)
    );
  });
  import GameBoard from "../components/GameBoard.svelte";
</script>

<h1>Goose Game 🧩</h1>

<p>
  Welcome to the Goose Game! This is a fun and interactive game where you can
  explore different categories and play with friends.
</p>
<p>Check the console for the list of categories loaded from Firebase.</p>

<GameBoard currentPosition={5} />

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
