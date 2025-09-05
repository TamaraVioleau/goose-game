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
  style="--case-color: {color}; grid-row: {row}; grid-column: {col};"
>
  <span class="label">{icon ?? id + 1}</span>
</div>

<style>
  .case {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    overflow: hidden;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.18), rgba(0,0,0,0.12)),
      var(--case-color);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    will-change: transform;
  }

  .case::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35), rgba(255,255,255,0) 45%),
                radial-gradient(circle at 75% 80%, rgba(0,0,0,0.12), rgba(0,0,0,0) 55%);
    pointer-events: none;
  }

  .case:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 6px 16px rgba(0,0,0,0.2);
  }

  .label {
    color: #fff;
    font-weight: 700;
    font-size: 15px;
    line-height: 1;
    text-shadow: 0 1px 1px rgba(0,0,0,0.25);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
</style>
