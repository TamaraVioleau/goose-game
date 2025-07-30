<!-- plateau principal en grille -->
<script lang="ts">
  import BoardCase from "./BoardCase.svelte";
  import Pawn from "./Pawn.svelte";
  import { generateGooseBoard } from "$lib/logic/generateGooseBoard";

  export let currentPosition = 0;

  const cases = generateGooseBoard();
</script>

<div class="board">
  {#each cases as c (c.id)}
    <BoardCase id={c.id} color={c.color} icon={c.icon} style="grid-row: {c.row}; grid-column: {c.col};" />
  {/each}

  {#if cases[currentPosition]}
    <Pawn row={cases[currentPosition].row} col={cases[currentPosition].col} />
  {/if}
</div>

<style>
  .board {
    display: grid;
    grid-template-columns: repeat(10, 40px);
    grid-template-rows: repeat(10, 40px);
    gap: 4px;
    width: fit-content;
    margin: 0 auto;
    position: relative;
  }
</style>
