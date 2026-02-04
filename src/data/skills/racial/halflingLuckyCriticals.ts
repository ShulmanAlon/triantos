import { SkillEntity } from '@/types/skills';

export const halflingLuckyCriticals: SkillEntity = {
  id: 'halflingLuckyCriticals',
  name: 'Lucky Criticals',
  family: 'utility',
  skillPointType: 'utility',
  description: 'Halflings are unusually lucky with critical strikes.',
  forbiddenRaces: ['Human', 'Elf', 'Dwarf'],
  tiers: [
    {
      tier: 1,
      name: 'Initial',
      description:
        'Double damage on 19 and 20 attack rolls (19 only if attack hit).',
      deltaDescription:
        'Double damage on 19 and 20 attack rolls (19 only if attack hit).',
      totalDescription:
        'Double damage on 19 and 20 attack rolls (19 only if attack hit).',
      freeForRaces: [{ raceId: 'Halfling', atLevel: 1 }],
      effects: [],
    },
  ],
};
