<!-- src/lib/components/GameBoard.svelte -->
<script lang="ts">
  import BoardCase from "./BoardCase.svelte";
  import { generateSpiralCases } from "$lib/logic/generateSpiralCases";
  const cases = generateSpiralCases(63);
</script>

<svg width="100%" height="auto" viewBox="0 0 700 700">
  {#each cases as c}
    <BoardCase {...c} />
  {/each}
</svg>
