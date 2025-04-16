import { describe, it, expect } from 'vitest';
import { getPointCostChange } from '../attributeUtils';

describe('getPointCostChange', () => {
  it('returns 0 if next <= baseline', () => {
    expect(getPointCostChange(10, 10, 10)).toBe(0);
    expect(getPointCostChange(12, 10, 10)).toBe(0);
  });

  it('returns the difference between next and baseline if next > baseline', () => {
    expect(getPointCostChange(10, 12, 10)).toBe(2);
    expect(getPointCostChange(10, 11, 10)).toBe(1);
  });
});
