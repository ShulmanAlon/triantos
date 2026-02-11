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
const totals = [1, 2, 3, 4, 5, 6, 7] as const;

export const elfSpellResistance: SkillEntity = {
  id: 'elfSpellResistance',
  name: 'Spell Resistance - Elf',
  family: 'utility',
  skillPointType: 'utility',
  description: 'Gain a bonus to resist spells.',
  forbiddenRaces: ['Human', 'Dwarf', 'Halfling'],
  tiers: totals.map((total, index) => {
    const tier = index + 1;
    const prevTotal = index === 0 ? 0 : totals[index - 1];
    const delta = total - prevTotal;
    const description = `+${total} total bonus to spell resistance.`;
    const deltaDescription = `+${delta} bonus.`;
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
              { type: 'skill', skillId: 'elfSpellResistance', tier: tier - 1 },
              { type: 'level', minimum: levels[index] },
            ],
      freeForRaces: [{ raceId: 'Elf', atLevel: levels[index] }],
      effects: [
        {
          target: 'spell_resistance_bonus',
          operation: 'add',
          value: delta,
          sourceSkill: 'elfSpellResistance',
          tier,
        },
      ],
    };
  }),
};
