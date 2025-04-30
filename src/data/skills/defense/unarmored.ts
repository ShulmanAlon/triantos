import { SkillEntity } from '@/types/skills';

export const unarmored: SkillEntity = {
  id: 'unarmored',
  name: 'Proficiency - Unarmored',
  family: 'defense',
  description: 'Clothes and robes, no armor.',
  tiers: [
    {
      tier: 1,
      name: 'Proficient',
      description: `Allows the use of:
    Chain Mail, Plate Armor, Ultron Nano Armor, Large Shield`,
      prerequisites: [{ type: 'attribute', attribute: 'str', minimum: 13 }],
      freeForClasses: [
        { classId: 'Fighter', atLevel: 1 },
        { classId: 'MagicUser', atLevel: 1 },
        { classId: 'Cleric', atLevel: 1 },
      ],
      effects: [
        {
          target: 'ac_with_unarmored',
          operation: 'enable',
          value: true,
          sourceSkill: 'unarmored',
          tier: 1,
        },
      ],
    },
    {
      tier: 2,
      name: 'Expert',
      description: `+1 AC when not using armor`,
      prerequisites: [{ type: 'level', minimum: 3 }],
      effects: [
        {
          target: 'ac_with_unarmored',
          operation: 'add',
          value: 1,
          sourceSkill: 'unarmored',
          tier: 2,
        },
      ],
    },
    {
      tier: 3,
      name: 'Master',
      description: `+2 AC when when not using armor (+2 total)`,
      prerequisites: [{ type: 'level', minimum: 6 }],
      effects: [
        {
          target: 'ac_with_unarmored',
          operation: 'add',
          value: 2,
          sourceSkill: 'unarmored',
          tier: 3,
        },
      ],
    },
  ],
};
