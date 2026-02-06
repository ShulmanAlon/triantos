import {
  CharacterDerivedStats,
  StatBlock,
  StatComponent,
  StatFormula,
} from '@/types/characters';
import { Attribute } from '@/types/attributes';
import { getModifier } from '../modifier';
import { getTagBasedModifier } from '@/utils/logic/tagModifiers';
import { getModifierValue, getProficiencyToggleKey } from '@/utils/domain/modifiers';
import { ProficiencyId } from '@/config/constants';

export type RangedType = 'basic' | 'advanced' | 'heavy' | 'mounted';

const RANGED_TYPES: { id: RangedType; label: string; key: string }[] = [
  { id: 'basic', label: 'Basic Ranged', key: 'attack_bonus_basic' },
  { id: 'advanced', label: 'Advanced Ranged', key: 'attack_bonus_ranged_advanced' },
  { id: 'heavy', label: 'Heavy Ranged', key: 'attack_bonus_ranged_heavy' },
  { id: 'mounted', label: 'Mounted', key: 'attack_bonus_mounted' },
];

export function buildRangedAttackStatBlock(
  attributes: Record<Attribute, number>,
  derived: CharacterDerivedStats,
  bab: number,
  selectedType?: { id: RangedType; label: string },
  requiredProficiencyId?: ProficiencyId
): StatBlock<number> {
  const dexMod = getModifier(attributes.dex);
  const flatBonus = getModifierValue(derived, 'attack_bonus_flat');
  const proficiencyKey = requiredProficiencyId
    ? (getProficiencyToggleKey(requiredProficiencyId) as keyof CharacterDerivedStats['toggles'])
    : null;
  const isProficient = proficiencyKey ? derived.toggles[proficiencyKey] : true;
  const entries: StatFormula[] = [];

  const selected =
    selectedType?.id && RANGED_TYPES.find((type) => type.id === selectedType.id);
  const types = selected ? [selected] : RANGED_TYPES;

  for (const type of types) {
    const tagBonus = getTagBasedModifier('attack_bonus', ['ranged', type.id], derived);
    const typeBonus = getModifierValue(derived, type.key) + tagBonus;

    const components: StatComponent[] = [
      { source: 'Base Attack Bonus', value: bab },
      { source: 'DEX Modifier', value: dexMod },
    ];

    if (selectedType || typeBonus !== 0) {
      components.push({
        source: `${type.label} Skill Bonus`,
        value: typeBonus,
      });
    }

    if (flatBonus !== 0) {
      components.push({
        source: 'Magic Bonus',
        value: flatBonus,
      });
    }

    if (requiredProficiencyId && !isProficient) {
      components.push({
        source: 'Proficiency Penalty',
        value: -4,
      });
    }

    entries.push({
      label: selectedType?.id === type.id ? selectedType.label : type.label,
      components,
      total: components.reduce((sum, c) => sum + c.value, 0),
    });
  }

  return {
    type: 'breakdown',
    entries,
  };
}
