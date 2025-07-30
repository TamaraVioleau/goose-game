// src/lib/utils/generateSpiralCases.ts
export interface CaseData {
  id: number;
  x: number;
  y: number;
  color: string;
  icon?: string;
}

export function generateSpiralCases(
  total: number,
  cellSize = 60,
  centerX = 250,
  centerY = 250,
  step = 60
): CaseData[] {
  const positions: { x: number; y: number }[] = [];
  const dim = Math.ceil(Math.sqrt(total));
  let left = 0,
    right = dim - 1,
    top = 0,
    bottom = dim - 1;

  while (positions.length < total) {
    for (let x = left; x <= right && positions.length < total; x++) {
      positions.push({ x, y: top });
    }
    top++;
    for (let y = top; y <= bottom && positions.length < total; y++) {
      positions.push({ x: right, y });
    }
    right--;
    for (let x = right; x >= left && positions.length < total; x--) {
      positions.push({ x, y: bottom });
    }
    bottom--;
    for (let y = bottom; y >= top && positions.length < total; y--) {
      positions.push({ x: left, y });
    }
    left++;
  }

  const offsetX = centerX - (dim * cellSize) / 2;
  const offsetY = centerY - (dim * cellSize) / 2;

  return positions.map(({ x, y }, i) => ({
    id: i,
    x: offsetX + x * cellSize,
    y: offsetY + y * cellSize,
    color: pickColor(i),
    icon: pickIcon(i),
  }));
}

function pickColor(i: number): string {
  const palette = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#6D28D9"];
  return palette[i % palette.length];
}

function pickIcon(i: number): string | undefined {
  if (i % 9 === 0) return "🌀";
  if (i % 13 === 0) return "🎯";
  return undefined;
}
