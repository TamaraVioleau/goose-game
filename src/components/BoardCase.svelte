<!-- case individuelle en grille -->
<script lang="ts">
  export let id: number;
  export let color: string;
  export let icon: string | null = null;
  export let row: number | undefined = undefined;
  export let col: number | undefined = undefined;
</script>

<div
  class="case"
  style="background-color: {color}; grid-row: {row}; grid-column: {col};"
>
  {icon ?? id + 1}
</div>

<style>
  .case {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    border-radius: 6px;
    color: white;
    font-size: 16px;
  }
</style>
