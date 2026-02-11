import { SkillEntity } from '@/types/skills';

export const elfMagicAffinity: SkillEntity = {
  id: 'elfMagicAffinity',
  name: 'Magic Affinity (Elf)',
  family: 'utility',
  skillPointType: 'utility',
  description: 'Elves have a natural affinity for magic.',
  forbiddenRaces: ['Human', 'Dwarf', 'Halfling'],
  tiers: [
    {
      tier: 1,
      name: 'Initial',
      description: 'Magic affinity (+1 to magic dice rolls).',
      deltaDescription: '+1 to magic dice rolls.',
      totalDescription: '+1 to magic dice rolls.',
      freeForRaces: [{ raceId: 'Elf', atLevel: 1 }],
      effects: [],
    },
  ],
};
