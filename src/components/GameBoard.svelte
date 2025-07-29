<!-- plateau principal -->
<script lang="ts">
  import BoardCase from "./BoardCase.svelte";
  import Pawn from "./Pawn.svelte";
  import { generateSpiralCases } from "$lib/logic/generateSpiralCases";

  export let total = 64;
  export let currentPosition = 0;

  const cases = generateSpiralCases(total);
</script>

<svg viewBox="0 0 500 500" width="100%" height="auto">
  {#each cases as c (c.id)}
    <BoardCase {...c} />
  {/each}

  {#if cases[currentPosition]}
    <Pawn x={cases[currentPosition].x} y={cases[currentPosition].y} />
  {/if}
</svg>
