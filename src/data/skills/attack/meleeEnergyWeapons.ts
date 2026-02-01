import { SkillEntity } from '@/types/skills';

export const meleeEnergyWeapons: SkillEntity = {
  id: 'meleeEnergyWeapons',
  name: 'Proficiency - Energy Melee Weapons',
  family: 'attack',
  skillPointType: 'core',
  description: 'Allows proficient use of: Power Fist, Plasma Cutter',
  tiers: [
    {
      tier: 1,
      name: 'Proficient',
      description: 'Proficient with energy melee weapons (no -4 penalty)',
      prerequisites: [{ type: 'level', minimum: 6 }],
      effects: [
        {
          target: 'proficiency.meleeEnergyWeapons',
          operation: 'enable',
          value: true,
          sourceSkill: 'meleeEnergyWeapons',
        },
      ],
    },
    {
      tier: 2,
      name: 'Expert',
      description: '+1 attack with energy melee weapons',
      prerequisites: [
        { type: 'skill', skillId: 'meleeEnergyWeapons', tier: 1 },
        { type: 'level', minimum: 10 },
      ],
      effects: [
        { target: 'attack_bonus_melee_energy', operation: 'add', value: 1 },
      ],
    },
    {
      tier: 3,
      name: 'Master',
      description: '+1 attack with energy melee weapons (+2 total)',
      prerequisites: [
        { type: 'skill', skillId: 'meleeEnergyWeapons', tier: 2 },
        { type: 'level', minimum: 14 },
      ],
      effects: [
        { target: 'attack_bonus_melee_energy', operation: 'add', value: 1 },
      ],
    },
  ],
};
