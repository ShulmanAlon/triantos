import { XP_TABLE } from '@/config/progression';

// TODO: Used for XP-based level-up calculations
export function getLevelFromXP(xp: number): number {
  for (let i = XP_TABLE.length - 1; i >= 0; i--) {
    if (xp >= XP_TABLE[i]) return i + 1;
  }
  return 1;
}
