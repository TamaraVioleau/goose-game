<!-- pion mobile -->
<script lang="ts">
  export let row: number;
  export let col: number;
</script>

<div class="pawn" style="grid-row: {row}; grid-column: {col};"></div>

<style>
  .pawn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    justify-self: center;
    align-self: center;
    position: relative;
    background: radial-gradient(circle at 35% 30%, #ffffff 0%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0) 40%),
                linear-gradient(145deg, #4f46e5, #06b6d4);
    border: 2px solid rgba(255,255,255,0.9);
    box-shadow: 0 3px 8px rgba(0,0,0,0.25), inset 0 0 0 2px rgba(255,255,255,0.2);
    z-index: 5;
  }
</style>
