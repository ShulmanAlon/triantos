import { SkillEntity } from '@/types/skills';

export const dwarfDarkvision: SkillEntity = {
  id: 'dwarfDarkvision',
  name: 'Darkvision',
  family: 'utility',
  skillPointType: 'utility',
  description: 'Dwarves can see in the dark.',
  forbiddenRaces: ['Human', 'Elf', 'Halfling'],
  tiers: [
    {
      tier: 1,
      name: 'Initial',
      description: 'Darkvision (30m).',
      freeForRaces: [{ raceId: 'Dwarf', atLevel: 1 }],
      effects: [],
    },
  ],
};
