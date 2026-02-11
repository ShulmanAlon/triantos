import { SkillEntity } from '@/types/skills';

export const elfDarkvision: SkillEntity = {
  id: 'elfDarkvision',
  name: 'Darkvision (Elf)',
  family: 'utility',
  skillPointType: 'utility',
  description: 'Elves can see in the dark.',
  forbiddenRaces: ['Human', 'Dwarf', 'Halfling'],
  tiers: [
    {
      tier: 1,
      name: 'Initial',
      description: 'Darkvision (30m).',
      deltaDescription: 'Darkvision (30m).',
      totalDescription: 'Darkvision (30m).',
      freeForRaces: [{ raceId: 'Elf', atLevel: 1 }],
      effects: [],
    },
  ],
};
