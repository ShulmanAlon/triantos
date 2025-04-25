import { describe, it, expect } from 'vitest';
import { getModifier } from './modifier';

describe('getModifier', () => {
  it('returns 0 for baseline 10', () => {
    expect(getModifier(10)).toBe(0);
  });

  it('returns +1 for 12', () => {
    expect(getModifier(12)).toBe(1);
  });

  it('returns -1 for 8', () => {
    expect(getModifier(8)).toBe(-1);
  });

  it('returns +4 for 18', () => {
    expect(getModifier(18)).toBe(4);
  });

  it('returns -3 for 3', () => {
    expect(getModifier(3)).toBe(-3);
  });

  it('handles 1 correctly', () => {
    expect(getModifier(1)).toBe(-4);
  });

  it('handles 20 correctly', () => {
    expect(getModifier(20)).toBe(5);
  });
});
