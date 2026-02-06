import {
  CharacterDerivedStats,
  StatBlock,
  StatComponent,
  StatFormula,
} from '@/types/characters';
import { getModifierValue } from '@/utils/modifiers';

export function buildTempHPStatBlock(
  derived: CharacterDerivedStats
): StatBlock<number> {
  const tempHP = getModifierValue(derived, 'hp_temp');

  const components: StatComponent[] = [];

  if (tempHP > 0) {
    components.push({
      source: 'Energy Shield',
      value: tempHP,
    });
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
