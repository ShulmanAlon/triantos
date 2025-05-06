import {
  CharacterDerivedStats,
  StatBlock,
  StatComponent,
  StatFormula,
} from '@/types/characters';

export function buildTempHPStatBlock(
  derived: CharacterDerivedStats
): StatBlock<number> {
  const tempHP = derived.modifiers['hp_temp'] ?? 0;

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
