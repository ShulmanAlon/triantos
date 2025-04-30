import { GameClass } from '@/types/gameClass';
import { Attribute } from '@/types/attributes';
import { getModifier } from '@/utils/modifier';
import { getClassLevelDataById } from '../classUtils';
import { DerivedStats } from '@/types/characters';
import { NAME_LEVEL } from '@/config/constants';

export function getBaseDerivedStats(
  gameClass: GameClass,
  attributes: Record<Attribute, number>,
  level: number
): DerivedStats {
  const conMod = getModifier(attributes.con);

  const hpFromCon = Math.min(level, NAME_LEVEL) * conMod;
  const hpFromBase = Math.min(level, NAME_LEVEL) * gameClass.hpPerLevelToNine;
  const hpFromFixed =
    Math.max(level - NAME_LEVEL, 0) * gameClass.hpPerLevelFromTen;

  const levelData = getClassLevelDataById(gameClass.id, level);

  return {
    hp: hpFromCon + hpFromBase + hpFromFixed,
    spellSlots: levelData?.spells,
    attackBonus: levelData?.attackBonus,
  };
}
