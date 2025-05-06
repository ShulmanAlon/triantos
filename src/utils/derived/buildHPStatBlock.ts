import {
  CharacterDerivedStats,
  StatBlock,
  StatComponent,
  StatFormula,
} from '@/types/characters';
import { Attribute } from '@/types/attributes';
import { GameClass } from '@/types/gameClass';
import { getModifier } from '../modifier';
import { NAME_LEVEL } from '@/config/constants';

export function buildHPStatBlock(
  gameClass: GameClass,
  attributes: Record<Attribute, number>,
  level: number,
  derived: CharacterDerivedStats
): StatBlock<number> {
  const flatBonus = derived.modifiers['hp_flat'] ?? 0;

  const conMod = getModifier(attributes.con);
  const base = Math.min(level, NAME_LEVEL) * gameClass.hpPerLevelToNine;
  const fixed = Math.max(level - NAME_LEVEL, 0) * gameClass.hpPerLevelFromTen;
  const con = Math.min(level, NAME_LEVEL) * conMod;

  const components: StatComponent[] = [
    { source: 'Base Class HP', value: base + fixed },
    { source: 'CON Modifier', value: con },
  ];

  if (flatBonus !== 0) {
    components.push({ source: 'Skill Bonus', value: flatBonus });
  }

  const total = components.reduce((sum, c) => sum + c.value, 0);

  const formula: StatFormula = {
    label: 'Total HP',
    components,
    total,
  };

  return {
    type: 'breakdown',
    entries: [formula],
  };
}
