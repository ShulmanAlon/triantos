import {
  CharacterDerivedStats,
  StatBlock,
  StatComponent,
  StatFormula,
} from '@/types/characters';
import { StatModifier } from '@/types/modifiers';
import { getModifierValue } from '@/utils/domain/modifiers';

export function buildTempHPStatBlock(
  derived: CharacterDerivedStats,
  derivedFromSkills: CharacterDerivedStats,
  equipmentModifiers: StatModifier[]
): StatBlock<number> {
  const tempHP = getModifierValue(derived, 'hp_temp');
  const skillTempHP = getModifierValue(derivedFromSkills, 'hp_temp');
  const equipmentTempHP = equipmentModifiers.reduce((sum, mod) => {
    if (mod.target === 'hp_temp' && mod.operation === 'add' && typeof mod.value === 'number') {
      return sum + mod.value;
    }
    return sum;
  }, 0);

  if (tempHP <= 0) {
    return {
      type: 'breakdown',
      entries: [
        {
          label: 'Temporary HP',
          components: [],
          total: 0,
        },
      ],
    };
  }

  const components: StatComponent[] = [];
  if (equipmentTempHP > 0) {
    components.push({ source: 'Energy Shield (Item)', value: equipmentTempHP });
  }
  if (skillTempHP > 0) {
    components.push({ source: 'Energy Shield Skill', value: skillTempHP });
  }
  if (components.length === 0) {
    components.push({ source: 'Energy Shield', value: tempHP });
  }

  const formula: StatFormula = {
    label: 'Temporary HP',
    components,
    total: tempHP,
  };

  return {
    type: 'breakdown',
    entries: [formula],
  };
}
