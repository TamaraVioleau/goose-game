<!-- src/lib/components/BoardCase.svelte -->
<script lang="ts">
  export let id: number;
  export let x: number;
  export let y: number;
  export let color: string;
  export let icon: string | null = null;
</script>

<g transform={`translate(${x}, ${y})`}>
  <rect width="50" height="50" rx="12" fill={color} stroke="white" stroke-width="2" />
  <text x="25" y="30" text-anchor="middle" fill="white" font-size="18" font-weight="bold">
    {icon ?? id + 1}
  </text>
</g>

