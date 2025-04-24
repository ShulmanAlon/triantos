import { GameClass } from '../types/gameClass';
import { Attribute } from '../types/attributes';
import { getModifier } from '../utils/modifier';
import { XP_TABLE } from '../config/progression';
import { getClassLevelDataById } from './classUtils';

export interface DerivedStats {
  hp: number;
  spellSlots?: Record<number, number>;
  attackBonus?: number;
}

// TODO: Used for XP-based level-up calculations
export function getLevelFromXP(xp: number): number {
  for (let i = XP_TABLE.length - 1; i >= 0; i--) {
    if (xp >= XP_TABLE[i]) return i + 1;
  }
  return 1;
}

export function calculateDerivedStats(
  gameClass: GameClass,
  attributes: Record<Attribute, number>,
  level: number
): DerivedStats {
  const conMod = getModifier(attributes.con);

  const hpFromCon = Math.min(level, 9) * conMod;
  const hpFromBase = Math.min(level, 9) * gameClass.hpPerLevelToNine;
  const hpFromFixed = Math.max(level - 9, 0) * gameClass.hpPerLevelFromTen;

  const levelData = getClassLevelDataById(gameClass.id, level);

  return {
    hp: hpFromCon + hpFromBase + hpFromFixed,
    spellSlots: levelData?.spells,
    attackBonus: levelData?.attackBonus,
  };
}
