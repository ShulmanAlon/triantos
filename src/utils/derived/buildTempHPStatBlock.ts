import {
  CharacterDerivedStats,
  StatBlock,
  StatComponent,
  StatFormula,
} from '@/types/characters';
import { getModifierValue } from '@/utils/domain/modifiers';

export function buildTempHPStatBlock(
  derived: CharacterDerivedStats
): StatBlock<number> {
  const tempHP = getModifierValue(derived, 'hp_temp');

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

  const components: StatComponent[] = [
    {
      source: 'Energy Shield',
      value: tempHP,
    },
  ];

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
