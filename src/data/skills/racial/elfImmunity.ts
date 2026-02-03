import { SkillEntity } from '@/types/skills';

export const elfImmunity: SkillEntity = {
  id: 'elfImmunity',
  name: 'Elven Immunity',
  family: 'utility',
  skillPointType: 'utility',
  description: 'Elves are immune to paralysis and sleep.',
  forbiddenRaces: ['Human', 'Dwarf', 'Halfling'],
  tiers: [
    {
      tier: 1,
      name: 'Initial',
      description: 'Immunity to paralysis and sleep.',
      freeForRaces: [{ raceId: 'Elf', atLevel: 1 }],
      effects: [],
    },
  ],
};
