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
  const coords: { x: number; y: number }[] = [];

  let x = centerX;
  let y = centerY;
  let dx = step;
  let dy = 0;
  let segmentLength = 1;
  let segmentPassed = 0;
  let turnCounter = 0;

  for (let i = 0; i < total; i++) {
    coords.push({ x, y });
    x += dx;
    y += dy;
    segmentPassed++;

    if (segmentPassed === segmentLength) {
      segmentPassed = 0;
      const temp = dx;
      dx = -dy;
      dy = temp;
      turnCounter++;
      if (turnCounter % 2 === 0) segmentLength++;
    }
  }

  coords.reverse();

  return coords.map((c, i) => ({
    id: i,
    x: c.x,
    y: c.y,
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
