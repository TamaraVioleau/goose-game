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
    grid-template-columns: repeat(10, 45px);
    grid-template-rows: repeat(10, 45px);
    gap: 6px;
    width: fit-content;
    padding: 16px;
    border-radius: 16px;
    background: rgba(255,255,255,0.75);
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    backdrop-filter: blur(2px);
  }
</style>
