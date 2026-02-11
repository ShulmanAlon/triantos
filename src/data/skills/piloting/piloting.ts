import { SkillEntity } from '@/types/skills';

export const piloting: SkillEntity = {
  id: 'piloting',
  name: 'Piloting',
  family: 'piloting',
  skillPointType: 'utility',
  description:
    'Piloting skill check, proficiencies for different vehicle types is required.',
  abilityModifier: 'dex',
  tiers: [
    {
      tier: 1,
      name: 'Initial',
      description: 'Can pilot wheeled vehicles at -4 penalty.',
      deltaDescription: 'Can pilot wheeled vehicles at -4 penalty.',
      totalDescription: 'Piloting checks at -4 penalty.',
      freeForClasses: [
        { classId: 'Fighter', atLevel: 1 },
        { classId: 'Cleric', atLevel: 1 },
        { classId: 'MagicUser', atLevel: 1 },
      ],
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
      deltaDescription: 'Removes the -4 piloting penalty.',
      totalDescription: 'Piloting checks with no penalty.',
      prerequisites: [
        { type: 'skill', skillId: 'piloting', tier: 1 },
        { type: 'level', minimum: 1 },
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
      deltaDescription: '+3 to piloting checks.',
      totalDescription: '+3 to piloting checks.',
      prerequisites: [
        { type: 'skill', skillId: 'piloting', tier: 2 },
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
      deltaDescription: '+3 to piloting checks.',
      totalDescription: '+6 to piloting checks.',
      prerequisites: [
        { type: 'skill', skillId: 'piloting', tier: 3 },
        { type: 'level', minimum: 7 },
        { type: 'attribute', attribute: 'dex', minimum: 15 },
      ],
      effects: [
        {
          target: 'piloting_check',
          operation: 'add',
          value: 3,
          sourceSkill: 'piloting',
          tier: 4,
        },
      ],
    },
    {
      tier: 5,
      name: 'Master',
      description: '+3 more to piloting (+9 total).',
      deltaDescription: '+3 to piloting checks.',
      totalDescription: '+9 to piloting checks.',
      prerequisites: [
        { type: 'skill', skillId: 'piloting', tier: 4 },
        { type: 'level', minimum: 10 },
        { type: 'attribute', attribute: 'dex', minimum: 17 },
        { type: 'attribute', attribute: 'wis', minimum: 13 },
      ],
      effects: [
        {
          target: 'piloting_check',
          operation: 'add',
          value: 3,
          sourceSkill: 'piloting',
          tier: 5,
        },
      ],
    },
  ],
};
