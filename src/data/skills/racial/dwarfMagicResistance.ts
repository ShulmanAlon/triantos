import { SkillEntity } from '@/types/skills';

export const dwarfMagicResistance: SkillEntity = {
  id: 'dwarfMagicResistance',
  name: 'Magic Resistance',
  family: 'utility',
  skillPointType: 'utility',
  description: 'Dwarves resist magical effects.',
  forbiddenRaces: ['Human', 'Elf', 'Halfling'],
  tiers: [
    {
      tier: 1,
      name: 'Initial',
      description: '+2 on saving throws vs spells.',
      freeForRaces: [{ raceId: 'Dwarf', atLevel: 1 }],
      effects: [],
    },
  ],
};
