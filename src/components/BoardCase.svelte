<!-- case individuelle -->

<script lang="ts">
  export let id: number;
  export let x: number;
  export let y: number;
  export let color: string;
  export let icon: string | null | undefined = undefined;
</script>

<g transform={`translate(${x}, ${y})`}>
  <rect width="36" height="36" rx="6" fill={color} stroke="black" />
  <text x="18" y="24" text-anchor="middle" fill="white" font-size="16">
    {icon ?? id + 1}
  </text>
</g>
