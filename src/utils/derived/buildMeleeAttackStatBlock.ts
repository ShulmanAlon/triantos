import {
  CharacterDerivedStats,
  StatBlock,
  StatComponent,
  StatFormula,
} from '@/types/characters';
import { Attribute } from '@/types/attributes';
import { getModifier } from '../modifier';
import { MELEE_TYPES } from '@/config/constants';

export function buildMeleeAttackStatBlock(
  attributes: Record<Attribute, number>,
  derived: CharacterDerivedStats,
  bab: number
): StatBlock<number> {
  const strMod = getModifier(attributes.str);

  const entries: StatFormula[] = [];

  for (const type of MELEE_TYPES) {
    const key = `melee_bonus_${type.toLowerCase()}`; // e.g. melee_bonus_slash
    const typeBonus = derived.modifiers[key] ?? 0;

    const components: StatComponent[] = [
      { source: 'Base Attack Bonus', value: bab },
      { source: 'STR Modifier', value: strMod },
    ];

    if (typeBonus !== 0) {
      components.push({
        source: `${type} Skill Bonus`,
        value: typeBonus,
      });
    }

    const total = components.reduce((sum, c) => sum + c.value, 0);

    entries.push({
      label: type,
      components,
      total,
    });
  }

  return {
    type: 'breakdown',
    entries,
  };
}
