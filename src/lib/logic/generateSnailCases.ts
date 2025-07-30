// src/lib/logic/generateSnailCases.ts
export interface CaseData {
  id: number;
  x: number;
  y: number;
  color: string;
  icon?: string;
}

export function generateSnailCases(
  total: number,
  caseSize = 40,
  gap = 8,
  centerX = 400,
  centerY = 400
): CaseData[] {
  const gridSize = Math.ceil(Math.sqrt(total));
  const grid: { x: number; y: number }[] = [];

  let minX = 0;
  let maxX = gridSize - 1;
  let minY = 0;
  let maxY = gridSize - 1;

  while (grid.length < total) {
    for (let x = minX; x <= maxX && grid.length < total; x++)
      grid.push({ x, y: minY });
    minY++;
    for (let y = minY; y <= maxY && grid.length < total; y++)
      grid.push({ x: maxX, y });
    maxX--;
    for (let x = maxX; x >= minX && grid.length < total; x--)
      grid.push({ x, y: maxY });
    maxY--;
    for (let y = maxY; y >= minY && grid.length < total; y--)
      grid.push({ x: minX, y });
    minX++;
  }

  const totalSize = gridSize * (caseSize + gap) - gap;
  const offsetX = centerX - totalSize / 2;
  const offsetY = centerY - totalSize / 2;

  return grid.map((pos, i) => ({
    id: i,
    x: offsetX + pos.x * (caseSize + gap),
    y: offsetY + pos.y * (caseSize + gap),
    color: pickColor(i),
    icon: pickIcon(i),
  }));
}

function pickColor(i: number): string {
  const colors = ["#3B82F6", "#F59E0B", "#10B981", "#EF4444", "#6B21A8"];
  return colors[i % colors.length];
}

function pickIcon(i: number): string | undefined {
  if (i % 11 === 0) return "⛈️";
  if (i % 7 === 0) return "🎲";
  return undefined;
}
