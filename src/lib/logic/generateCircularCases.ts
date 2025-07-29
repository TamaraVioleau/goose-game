export interface CaseData {
  id: number;
  x: number;
  y: number;
  color: string;
  icon?: string;
}

export function generateCircularCases(
  total: number,
  centerX = 250,
  centerY = 250,
  radius = 200
): CaseData[] {
  const cases: CaseData[] = [];
  const angleStep = (2 * Math.PI) / total;

  for (let i = 0; i < total; i++) {
    const angle = i * angleStep;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    cases.push({
      id: i,
      x,
      y,
      color: pickColor(i),
      icon: pickIcon(i),
    });
  }

  return cases;
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
