import { SkillEntity } from '@/types/skills';

export const piloting: SkillEntity = {
  id: 'piloting',
  name: 'Piloting',
  family: 'piloting',
  description:
    'Allows driving wheeled vehicles. Other vehicle types require specific proficiencies.',
  abilityModifier: 'dex',
  tiers: [
    {
      tier: 1,
      name: 'Initial',
      description: 'Can pilot wheeled vehicles at -4 penalty.',
      effects: [
        {
          target: 'piloting_check',
          operation: 'add',
          value: -4,
          sourceSkill: 'piloting',
          tier: 1,
        },
      ],
    },
    {
      tier: 2,
      name: 'Basic',
      description: 'No penalty to piloting checks.',
      prerequisites: [
        { type: 'attribute', attribute: 'int', minimum: 9 },
        { type: 'attribute', attribute: 'wis', minimum: 9 },
      ],
      effects: [
        {
          target: 'piloting_check',
          operation: 'add',
          value: 4,
          sourceSkill: 'piloting',
          tier: 2,
        },
      ],
    },
    {
      tier: 3,
      name: 'Advanced',
      description: '+3 to piloting checks.',
      prerequisites: [
        { type: 'level', minimum: 4 },
        { type: 'attribute', attribute: 'wis', minimum: 11 },
      ],
      effects: [
        {
          target: 'piloting_check',
          operation: 'add',
          value: 3,
          sourceSkill: 'piloting',
          tier: 3,
        },
      ],
    },
    {
      tier: 4,
      name: 'Expert',
      description: '+3 more to piloting (+6 total).',
      prerequisites: [
        { type: 'level', minimum: 8 },
        { type: 'attribute', attribute: 'dex', minimum: 15 },
      ],
      effects: [
        {
          target: 'piloting_check',
          operation: 'add',
          value: 6,
          sourceSkill: 'piloting',
          tier: 4,
        },
      ],
    },
    {
      tier: 5,
      name: 'Master',
      description: '+3 more to piloting (+9 total).',
      prerequisites: [
        { type: 'level', minimum: 12 },
        { type: 'attribute', attribute: 'dex', minimum: 17 },
        { type: 'attribute', attribute: 'wis', minimum: 13 },
      ],
      effects: [
        {
          target: 'piloting_check',
          operation: 'add',
          value: 9,
          sourceSkill: 'piloting',
          tier: 5,
        },
      ],
    },
  ],
};
