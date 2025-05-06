import { SkillEntity } from '@/types/skills';

export const strongVitality: SkillEntity = {
  id: 'strongVitality',
  name: 'Strong Vitality',
  family: 'defense',
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
        { type: 'level', minimum: 6 },
        { type: 'attribute', attribute: 'con', minimum: 13 },
      ],
      effects: [
        {
          target: 'hp_flat',
          operation: 'add',
          value: 15,
          sourceSkill: 'strong_vitality',
          tier: 2,
        },
      ],
    },
  ],
};
