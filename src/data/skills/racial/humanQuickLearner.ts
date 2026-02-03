import { SkillEntity } from '@/types/skills';

export const humanQuickLearner: SkillEntity = {
  id: 'humanQuickLearner',
  name: 'Quick Learner',
  family: 'utility',
  skillPointType: 'utility',
  description: 'Humans gain extra skill points at key levels.',
  forbiddenRaces: ['Elf', 'Dwarf', 'Halfling'],
  tiers: [
    {
      tier: 1,
      name: 'Initial',
      description: 'Quick learner (extra skill points at levels 3, 6, 9, 12).',
      freeForRaces: [{ raceId: 'Human', atLevel: 1 }],
      effects: [],
    },
  ],
};
