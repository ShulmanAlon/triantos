import { SkillEntity } from '@/types/skills';

export const energyShield: SkillEntity = {
  id: 'energyShield',
  name: 'Energy Shield',
  family: 'defense',
  description:
    'Allows the use of Energy Shield, must be equipped and powered, creates a thin energy shield around the user, granting temporary HP',
  tiers: [
    {
      tier: 1,
      name: 'Proficient',
      description: 'Energy Shield grants 10 temporary HP',
      prerequisites: [{ type: 'level', minimum: 6 }],
      effects: [
        {
          target: 'hp_temp',
          operation: 'add',
          value: 10,
          sourceSkill: 'hp_temp',
          tier: 1,
        },
      ],
    },
    {
      tier: 2,
      name: 'Advanced',
      description: 'Energy Shield grants 20 temporary HP',
      prerequisites: [{ type: 'level', minimum: 10 }],
      effects: [
        {
          target: 'hp_temp',
          operation: 'add',
          value: 20,
          sourceSkill: 'strong_vitality',
          tier: 2,
        },
      ],
    },
    {
      tier: 3,
      name: 'Expert',
      description: 'Energy Shield grants 30 temporary HP',
      prerequisites: [{ type: 'level', minimum: 14 }],
      effects: [
        {
          target: 'hp_temp',
          operation: 'add',
          value: 30,
          sourceSkill: 'strong_vitality',
          tier: 3,
        },
      ],
    },
  ],
};
