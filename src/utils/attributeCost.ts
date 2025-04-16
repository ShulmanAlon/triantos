export function getPointCostChange(
  from: number,
  to: number,
  baseline: number
): number {
  let cost = 0;
  const step = from < to ? 1 : -1;

  for (let i = from; i !== to; i += step) {
    const currentOffset = Math.abs(i - baseline);
    const nextOffset = Math.abs(i + step - baseline);
    cost += step * Math.max(currentOffset, nextOffset);
  }

  return cost;
}
