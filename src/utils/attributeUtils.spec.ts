import { describe, it, expect } from 'vitest';
import { getPointCostChange } from './attributeUtils';

describe('getPointCostChange', () => {
  it('returns 0 when no change', () => {
    expect(getPointCostChange(10, 10, 10)).toBe(0);
  });

  it('refunds 2 when moving down from 12 to 11 with 10 baseline', () => {
    expect(getPointCostChange(12, 11, 10)).toBe(-2);
  });

  it('charges properly when moving up two steps from baseline', () => {
    expect(getPointCostChange(10, 12, 10)).toBe(3);
  });

  it('charges 1 when moving up one step from baseline', () => {
    expect(getPointCostChange(10, 11, 10)).toBe(1);
  });

  it('refunds 1 when moving further below baseline', () => {
    expect(getPointCostChange(7, 6, 10)).toBe(-1);
  });

  it('charges 5 for high increases', () => {
    expect(getPointCostChange(17, 18, 10)).toBe(5);
  });

  it('charges 5 for high increases with different baseline', () => {
    expect(getPointCostChange(19, 20, 12)).toBe(5);
  });

  it('charges 2 when moving from 11 to 12 at baseline 10', () => {
    expect(getPointCostChange(11, 12, 10)).toBe(2);
  });

  it('charges 2 when moving from 12 to 13 at baseline 10', () => {
    expect(getPointCostChange(12, 13, 10)).toBe(2);
  });

  it('charges 3 when moving from 13 to 14 at baseline 10', () => {
    expect(getPointCostChange(13, 14, 10)).toBe(3);
  });

  it('charges 4 when moving from 13 to 14 at baseline 8', () => {
    expect(getPointCostChange(13, 14, 8)).toBe(4);
  });

  it('refunds 2 when moving from 8 to 6 at baseline 10', () => {
    expect(getPointCostChange(8, 6, 10)).toBe(-2);
  });

  it('refunds 1 when moving from 9 to 8 at baseline 10', () => {
    expect(getPointCostChange(9, 8, 10)).toBe(-1);
  });

  it('charges correctly when crossing baseline upward', () => {
    expect(getPointCostChange(9, 11, 10)).toBe(2);
  });

  it('refunds correctly when crossing baseline downward', () => {
    expect(getPointCostChange(12, 9, 10)).toBe(-4);
  });

  it('refunds correctly when dropping from baseline to below', () => {
    expect(getPointCostChange(10, 8, 10)).toBe(-2);
  });

  it('charges correctly when rising from below to baseline', () => {
    expect(getPointCostChange(8, 10, 10)).toBe(2);
  });
});
