<!-- pion mobile -->
<script lang="ts">
  export let row: number;
  export let col: number;
</script>

<div class="pawn" style="grid-row: {row}; grid-column: {col};"></div>

<style>
  .pawn {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: black;
    border: 2px solid white;
    justify-self: center;
    align-self: center;
  }
</style>
