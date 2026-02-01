import { SkillEntity } from '@/types/skills';

export const strongVitality: SkillEntity = {
  id: 'strongVitality',
  name: 'Strong Vitality',
  family: 'defense',
  skillPointType: 'core',
  description: 'Tough to take down, gain HP',
  tiers: [
    {
      tier: 1,
      name: 'Advanced',
      description: 'Gain 5 additional HP',
      prerequisites: [{ type: 'level', minimum: 3 }],
      effects: [
        {
          target: 'hp_flat',
          operation: 'add',
          value: 5,
          sourceSkill: 'strong_vitality',
          tier: 1,
        },
      ],
    },
    {
      tier: 2,
      name: 'Expert',
      description: 'Gain 10 more additional HP (+15 total)',
      prerequisites: [
        { type: 'skill', skillId: 'strongVitality', tier: 1 },
        { type: 'level', minimum: 6 },
        { type: 'attribute', attribute: 'con', minimum: 13 },
      ],
      effects: [
        {
          target: 'hp_flat',
          operation: 'add',
          value: 10,
          sourceSkill: 'strong_vitality',
          tier: 2,
        },
      ],
    },
  ],
};
