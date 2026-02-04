import { SkillEntity } from '@/types/skills';

export const dwarfMagicDamageReduction: SkillEntity = {
  id: 'dwarfMagicDamageReduction',
  name: 'Magic Damage Resistance',
  family: 'utility',
  skillPointType: 'utility',
  description: 'Dwarves gain resistance to magic damage at higher levels.',
  forbiddenRaces: ['Human', 'Elf', 'Halfling'],
  tiers: [
    {
      tier: 1,
      name: 'Initial',
      description: 'Half damage from magic effects.',
      deltaDescription: 'Half damage from magic effects.',
      totalDescription: 'Half damage from magic effects.',
      freeForRaces: [{ raceId: 'Dwarf', atLevel: 11 }],
      effects: [],
    },
  ],
};
