import {
  CharacterDerivedStats,
  StatBlock,
  StatComponent,
  StatFormula,
} from '@/types/characters';
import { Attribute } from '@/types/attributes';
import { getModifier } from '../modifier';
import { getTagBasedModifier } from '@/utils/logic/tagModifiers';

type RangedType = 'basic' | 'advanced' | 'heavy' | 'mounted';

const RANGED_TYPES: { id: RangedType; label: string; key: string }[] = [
  { id: 'basic', label: 'Basic Ranged', key: 'attack_bonus_basic' },
  { id: 'advanced', label: 'Advanced Ranged', key: 'attack_bonus_ranged_advanced' },
  { id: 'heavy', label: 'Heavy Ranged', key: 'attack_bonus_ranged_heavy' },
  { id: 'mounted', label: 'Mounted', key: 'attack_bonus_mounted' },
];

export function buildRangedAttackStatBlock(
  attributes: Record<Attribute, number>,
  derived: CharacterDerivedStats,
  bab: number
): StatBlock<number> {
  const dexMod = getModifier(attributes.dex);
  const entries: StatFormula[] = [];

  for (const type of RANGED_TYPES) {
    const tagBonus = getTagBasedModifier('attack_bonus', ['ranged', type.id], derived);
    const typeBonus = (derived.modifiers[type.key] ?? 0) + tagBonus;

    const components: StatComponent[] = [
      { source: 'Base Attack Bonus', value: bab },
      { source: 'DEX Modifier', value: dexMod },
    ];

    if (typeBonus !== 0) {
      components.push({
        source: `${type.label} Skill Bonus`,
        value: typeBonus,
      });
    }

    entries.push({
      label: type.label,
      components,
      total: components.reduce((sum, c) => sum + c.value, 0),
    });
  }

  return {
    type: 'breakdown',
    entries,
  };
}
