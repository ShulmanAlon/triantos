const costMap = new Map<number, number>([
  [6, -4],
  [7, -3],
  [8, -2],
  [9, -1],
  [10, 0],
  [11, 1],
  [12, 3],
  [13, 5],
  [14, 8],
  [15, 11],
  [16, 15],
  [17, 19],
  [18, 24],
]);

export function getPointCostChange(
  from: number,
  to: number,
  baseline: number
): number | null {
  const getCost = (val: number) => {
    if (val < 6 || val > 18) return null;
    const base = costMap.get(baseline) ?? 0;
    const valCost = costMap.get(val);
    return valCost !== undefined ? valCost - base : null;
  };

  const costFrom = getCost(from);
  const costTo = getCost(to);
  if (costFrom === null || costTo === null) return null;
  return costTo - costFrom;
}
