import { SkillEntity } from '@/types/skills';

export const gunner: SkillEntity = {
  id: 'gunner',
  name: 'Proficiency - Mounted Weapons',
  family: 'attack',
  description:
    'Allows proficient use of static mounted weapons, such as on bases, vehicles etc..',
  tiers: [
    {
      tier: 1,
      name: 'Proficient',
      description: 'Proficient using mounted weapons (no -4 penalty)',
      prerequisites: [{ type: 'level', minimum: 2 }],
      effects: [
        {
          target: 'proficiency.rangedMounted',
          operation: 'enable',
          value: true,
          sourceSkill: 'gunner',
        },
      ],
    },
    {
      tier: 2,
      name: 'Expert',
      description: '+2 attack with mounted weapons',
      prerequisites: [
        { type: 'skill', skillId: 'gunner', tier: 1 },
        { type: 'level', minimum: 6 },
        { type: 'attribute', attribute: 'dex', minimum: 13 },
      ],
      effects: [{ target: 'attack_bonus_mounted', operation: 'add', value: 2 }],
    },
    {
      tier: 3,
      name: 'Master',
      description: '+2 attack with mounted weapons (+2 total)',
      prerequisites: [
        { type: 'skill', skillId: 'gunner', tier: 2 },
        { type: 'level', minimum: 10 },
        { type: 'attribute', attribute: 'dex', minimum: 15 },
        { type: 'attribute', attribute: 'wis', minimum: 11 },
      ],
      effects: [{ target: 'attack_bonus_mounted', operation: 'add', value: 2 }],
    },
  ],
};
