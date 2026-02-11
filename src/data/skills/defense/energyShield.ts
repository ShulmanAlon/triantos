import { SkillEntity } from '@/types/skills';

export const energyShield: SkillEntity = {
  id: 'energyShield',
  name: 'Energy Shield',
  family: 'defense',
  skillPointType: 'core',
  description:
    'Allows the use of Energy Shield, must be equipped and powered, creates a thin energy shield around the user, granting temporary HP',
  tiers: [
    {
      tier: 1,
      name: 'Proficient',
      description: 'Enables using energy shield',
      deltaDescription: 'Unlock Energy Shield use.',
      totalDescription: 'Can use Energy Shield.',
      prerequisites: [
        { type: 'level', minimum: 5 },
        { type: 'attribute', attribute: 'int', minimum: 11 },
      ],
      effects: [
        {
          target: 'proficiency.energyShield',
          operation: 'enable',
          value: true,
          sourceSkill: 'energyShield',
          tier: 1,
        },
      ],
    },
    {
      tier: 2,
      name: 'Advanced',
      description: 'Energy Shield grants +10 temporary HP',
      deltaDescription: 'Energy Shield grants +10 temporary HP.',
      totalDescription: 'Energy Shield grants +10 temporary HP.',
      prerequisites: [
        { type: 'skill', skillId: 'energyShield', tier: 1 },
        { type: 'level', minimum: 11 },
      ],
      effects: [
        {
          target: 'hp_temp',
          operation: 'add',
          value: 10,
          sourceSkill: 'energy_shield',
          tier: 2,
        },
      ],
    },
    {
      tier: 3,
      name: 'Expert',
      description: 'Energy Shield grants +20 temporary HP',
      deltaDescription: 'Energy Shield grants +10 temporary HP.',
      totalDescription: 'Energy Shield grants +20 temporary HP.',
      prerequisites: [
        { type: 'skill', skillId: 'energyShield', tier: 2 },
        { type: 'level', minimum: 14 },
      ],
      effects: [
        {
          target: 'hp_temp',
          operation: 'add',
          value: 10,
          sourceSkill: 'energy_shield',
          tier: 3,
        },
      ],
    },
  ],
};
