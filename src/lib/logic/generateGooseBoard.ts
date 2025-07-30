export interface GridCaseData {
  number: number;
  id: number;
  row: number;
  col: number;
  color: string;
  icon?: string;
}

export function generateGooseBoard(): GridCaseData[] {
  const cases: GridCaseData[] = [];
  let id = 0;

  // Row 1: 1-10 left to right
  for (let col = 1; col <= 10; col++) {
    cases.push(makeCase(id++, 1, col));
  }

  // Row 2: case 11 at col 10
  cases.push(makeCase(id++, 2, 10));

  // Row 3: 12-21 right to left
  for (let col = 10; col >= 1; col--) {
    cases.push(makeCase(id++, 3, col));
  }

  // Row 4: case 22 at col 1
  cases.push(makeCase(id++, 4, 1));

  // Row 5: 23-32 left to right
  for (let col = 1; col <= 10; col++) {
    cases.push(makeCase(id++, 5, col));
  }

  // Row 6: case 33 at col 10
  cases.push(makeCase(id++, 6, 10));

  // Row 7: 34-43 right to left
  for (let col = 10; col >= 1; col--) {
    cases.push(makeCase(id++, 7, col));
  }

  // Row 8: case 44 at col 1
  cases.push(makeCase(id++, 8, 1));

  // Row 9: 45-50 left to right (only 6 cells visible)
  for (let col = 1; col <= 6; col++) {
    cases.push(makeCase(id++, 9, col));
  }

  return cases;
}

function makeCase(id: number, row: number, col: number): GridCaseData {
  return {
    id,
    row,
    col,
    color: pickColor(id),
    icon: pickIcon(id)
  };
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
