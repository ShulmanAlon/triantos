import { SkillEntity } from '@/types/skills';

const levels = [1, 2, 5, 8, 11, 14, 17] as const;
const tierNames = [
  'Tier 1',
  'Tier 2',
  'Tier 3',
  'Tier 4',
  'Tier 5',
  'Tier 6',
  'Tier 7',
] as const;
const totals = [0, 1, 2, 3, 4, 5, 6] as const;

export const humanSpellResistance: SkillEntity = {
  id: 'humanSpellResistance',
  name: 'Spell Resistance - Human',
  family: 'utility',
  skillPointType: 'utility',
  description: 'Gain a bonus to resist spells.',
  forbiddenRaces: ['Elf', 'Dwarf', 'Halfling'],
  tiers: totals.map((total, index) => {
    const tier = index + 1;
    const prevTotal = index === 0 ? 0 : totals[index - 1];
    const delta = total - prevTotal;
    const description =
      total === 0
        ? 'No bonus to spell resistance.'
        : `+${total} total bonus to spell resistance.`;
    const deltaDescription =
      delta === 0 ? 'No increase to spell resistance.' : `+${delta} bonus.`;
    return {
      tier,
      name: tierNames[index],
      description,
      deltaDescription,
      totalDescription: description,
      prerequisites:
        index === 0
          ? []
          : [
              { type: 'skill', skillId: 'humanSpellResistance', tier: tier - 1 },
              { type: 'level', minimum: levels[index] },
            ],
      freeForRaces: [{ raceId: 'Human', atLevel: levels[index] }],
      effects: [
        {
          target: 'spell_resistance_bonus',
          operation: 'add',
          value: delta,
          sourceSkill: 'humanSpellResistance',
          tier,
        },
      ],
    };
  }),
};
