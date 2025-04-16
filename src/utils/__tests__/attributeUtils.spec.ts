import { describe, it, expect } from 'vitest';
import { getPointCostChange } from '../attributeUtils';

describe('getPointCostChange', () => {
  it(() => {
    expect(getPointCostChange(10, 10, 10)).toBe(0);
    expect(getPointCostChange(12, 11, 10)).toBe(-1);
    expect(getPointCostChange(10, 12, 10)).toBe(2);
    expect(getPointCostChange(10, 11, 10)).toBe(1);
    expect(getPointCostChange(7, 6, 10)).toBe(-1);
    expect(getPointCostChange(17, 18, 10)).toBe(5);
    expect(getPointCostChange(19, 20, 12)).toBe(5);
    expect(getPointCostChange(11, 12, 10)).toBe(2);
    expect(getPointCostChange(12, 13, 10)).toBe(2);
    expect(getPointCostChange(13, 14, 10)).toBe(3);
    expect(getPointCostChange(13, 14, 8)).toBe(4);
  });
});
