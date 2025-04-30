import { SkillEntity } from '@/types/skills';

export const shieldFortress: SkillEntity = {
  id: 'shieldFortress',
  name: 'Shield Fortress',
  family: 'defense',
  forbiddenClasses: ['MagicUser'],
  description: 'Increase AC when using a shield.',
  tiers: [
    {
      tier: 1,
      name: 'Advanced',
      description: '+1 AC when using a shield.',
      prerequisites: [
        { type: 'level', minimum: 4 },
        { type: 'attribute', attribute: 'con', minimum: 13 },
      ],
      effects: [
        {
          target: 'ac_with_shield',
          operation: 'add',
          value: 1,
          sourceSkill: 'shieldFortress',
          tier: 1,
        },
      ],
    },
    {
      tier: 2,
      name: 'Expert',
      description: 'Additional +1 AC with shield (+2 total).',
      prerequisites: [
        { type: 'level', minimum: 10 },
        { type: 'attribute', attribute: 'con', minimum: 15 },
      ],
      effects: [
        {
          target: 'ac_with_shield',
          operation: 'add',
          value: 2,
          sourceSkill: 'shieldFortress',
          tier: 2,
        },
      ],
    },
    {
      tier: 3,
      name: 'Master',
      description: 'Additional +1 AC with shield (+3 total).',
      prerequisites: [
        { type: 'level', minimum: 16 },
        { type: 'attribute', attribute: 'con', minimum: 17 },
      ],
      effects: [
        {
          target: 'ac_with_shield',
          operation: 'add',
          value: 3,
          sourceSkill: 'shieldFortress',
          tier: 3,
        },
      ],
    },
  ],
};
