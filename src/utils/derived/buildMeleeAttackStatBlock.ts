import {
  CharacterDerivedStats,
  StatBlock,
  StatComponent,
  StatFormula,
} from '@/types/characters';
import { Attribute } from '@/types/attributes';
import { getModifier } from '../modifier';
import { MELEE_TYPES } from '@/config/constants';
import { getTagBasedModifier } from '@/utils/logic/tagModifiers';

export function buildMeleeAttackStatBlock(
  attributes: Record<Attribute, number>,
  derived: CharacterDerivedStats,
  bab: number
): StatBlock<number> {
  const strMod = getModifier(attributes.str);

  const entries: StatFormula[] = [];

  for (const type of MELEE_TYPES) {
    const lowerType = type.toLowerCase();
    const attackKey = `attack_bonus_melee_${lowerType}`;
    const tagBonus = getTagBasedModifier('attack_bonus', ['melee', lowerType], derived);
    const typeBonus = (derived.modifiers[attackKey] ?? 0) + tagBonus;

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
