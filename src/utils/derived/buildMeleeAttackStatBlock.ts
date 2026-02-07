import {
  CharacterDerivedStats,
  StatBlock,
  StatComponent,
  StatFormula,
} from '@/types/characters';
import { Attribute } from '@/types/attributes';
import { getModifier } from '../modifier';
import { MELEE_TYPES, MeleeTypes, ProficiencyId } from '@/config/constants';
import { getTagBasedModifier } from '@/utils/logic/tagModifiers';
import { getModifierValue, getProficiencyToggleKey } from '@/utils/domain/modifiers';

export function buildMeleeAttackStatBlock(
  attributes: Record<Attribute, number>,
  derived: CharacterDerivedStats,
  bab: number,
  selectedType?: { id: MeleeTypes; label: string },
  requiredProficiencyId?: ProficiencyId
): StatBlock<number> {
  const strMod = getModifier(attributes.str);
  const flatBonus = getModifierValue(derived, 'attack_bonus_flat');
  const basicBonus = getModifierValue(derived, 'attack_bonus_basic');
  const twoHandedBonus = getModifierValue(derived, 'attack_bonus_melee_2h');
  const proficiencyKey = requiredProficiencyId
    ? (getProficiencyToggleKey(requiredProficiencyId) as keyof CharacterDerivedStats['toggles'])
    : null;
  const isProficient = proficiencyKey ? derived.toggles[proficiencyKey] : true;
  const applyBasicBonus = requiredProficiencyId === 'basicWeapons';
  const applyTwoHandedBonus = requiredProficiencyId === 'melee2hWeapons';

  const entries: StatFormula[] = [];

  const types = selectedType ? [selectedType.id] : MELEE_TYPES;

  for (const type of types) {
    const attackKey = `attack_bonus_melee_${type}`;
    const tagBonus = getTagBasedModifier('attack_bonus', ['melee', type], derived);
    const typeBonus = getModifierValue(derived, attackKey) + tagBonus;
    const hasTypeSkill =
      Object.prototype.hasOwnProperty.call(derived.modifiers, attackKey) ||
      tagBonus !== 0;

    const components: StatComponent[] = [
      { source: 'Base Attack', value: bab },
      { source: 'STR Mod', value: strMod },
    ];

    if ((selectedType && hasTypeSkill) || typeBonus !== 0) {
      const displayType =
        type === 'energy'
          ? 'Energy Melee'
          : `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
      components.push({
        source: `${displayType} Skill`,
        value: typeBonus,
      });
    }

    if (applyBasicBonus && basicBonus !== 0) {
      components.push({
        source: 'Basic Weapons Skill',
        value: basicBonus,
      });
    }

    if (applyTwoHandedBonus && twoHandedBonus !== 0) {
      components.push({
        source: '2-Handed Skill',
        value: twoHandedBonus,
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

    const total = components.reduce((sum, c) => sum + c.value, 0);

    entries.push({
      label: selectedType?.id === type ? selectedType.label : type,
      components,
      total,
    });
  }

  return {
    type: 'breakdown',
    entries,
  };
}
