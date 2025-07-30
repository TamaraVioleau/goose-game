export interface CaseData {
  id: number;
  x: number;
  y: number;
  color: string;
  icon?: string;
}

export function generateSnailCases(
  total: number,
  centerX = 250,
  centerY = 250,
  step = 40
): CaseData[] {
  // Size of the square grid needed to fit all cases
  const dim = Math.ceil(Math.sqrt(total));

  // Bounds of the current spiral segment in grid coordinates
  let top = 0;
  let bottom = dim - 1;
  let left = 0;
  let right = dim - 1;

  // Collect grid coordinates following a clockwise spiral
  const grid: { x: number; y: number }[] = [];

  while (grid.length < total) {
    // left -> right
    for (let x = left; x <= right && grid.length < total; x++) {
      grid.push({ x, y: top });
    }
    top++;

    // top -> bottom on right side
    for (let y = top; y <= bottom && grid.length < total; y++) {
      grid.push({ x: right, y });
    }
    right--;

    // right -> left on bottom
    for (let x = right; x >= left && grid.length < total; x--) {
      grid.push({ x, y: bottom });
    }
    bottom--;

    // bottom -> top on left side
    for (let y = bottom; y >= top && grid.length < total; y--) {
      grid.push({ x: left, y });
    }
    left++;
  }

  // translate grid coordinates so the board is centered in the viewBox
  const boardSize = (dim - 1) * step;
  const offsetX = centerX - boardSize / 2;
  const offsetY = centerY - boardSize / 2;

  return grid.map((c, i) => ({
    id: i,
    x: offsetX + c.x * step,
    y: offsetY + c.y * step,
    color: pickColor(i),
    icon: pickIcon(i),
  }));
}

function pickColor(i: number): string {
  const colors = ["#3B82F6", "#F59E0B", "#10B981", "#EF4444", "#6B21A8"];
  return colors[i % colors.length];
}

function pickIcon(i: number): string | undefined {
  if (i % 7 === 0) return "🎲";
  if (i % 11 === 0) return "⛈️";
  return undefined;
}
