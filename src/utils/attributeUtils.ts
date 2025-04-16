export interface AttributeState {
  [key: string]: number;
}

export const BASELINE: AttributeState = {
  STR: 10,
  DEX: 10,
  WIS: 10,
  INT: 10,
  CON: 10,
  CHA: 10,
};

export const getPointCostChange = (
  current: number,
  next: number,
  baseline: number
): number => {
  if (next <= baseline) return 0;
  return next - baseline;
};
