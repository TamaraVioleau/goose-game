<!-- plateau principal -->
<script lang="ts">
  import BoardCase from "./BoardCase.svelte";
  import Pawn from "./Pawn.svelte";
  import { generateGooseBoard } from "$lib/logic/generateGooseBoard";

  export let currentPosition = 0;

  // Ensure each case has a 'number' property
  const cases = generateGooseBoard().map((c, i) => ({
    ...c,
    number: c.number ?? i + 1,
  }));
</script>

<div class="board">
  {#each cases as c (c.id)}
    <BoardCase {...c} />
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
  }
</style>
