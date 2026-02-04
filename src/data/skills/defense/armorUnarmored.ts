import { SkillEntity } from '@/types/skills';

export const armorUnarmored: SkillEntity = {
  id: 'armorUnarmored',
  name: 'Proficiency - Unarmored',
  family: 'defense',
  skillPointType: 'core',
  description: 'Clothes and robes, no armor.',
  tiers: [
    {
      tier: 1,
      name: 'Proficient',
      description: `Basic clothing, no armor`,
      deltaDescription: 'Unarmored AC proficiency.',
      totalDescription: 'Can benefit from unarmored AC.',
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
          sourceSkill: 'armorUnarmored',
          tier: 1,
        },
      ],
    },
    {
      tier: 2,
      name: 'Expert',
      description: `+1 AC when not using armor`,
      deltaDescription: '+1 AC when unarmored.',
      totalDescription: '+1 AC when unarmored.',
      prerequisites: [
        { type: 'skill', skillId: 'armorUnarmored', tier: 1 },
        { type: 'level', minimum: 3 },
      ],
      effects: [
        {
          target: 'ac_with_unarmored',
          operation: 'add',
          value: 1,
          sourceSkill: 'armorUnarmored',
          tier: 2,
        },
      ],
    },
    {
      tier: 3,
      name: 'Master',
      description: `+1 AC when when not using armor (+2 total)`,
      deltaDescription: '+1 AC when unarmored.',
      totalDescription: '+2 AC when unarmored.',
      prerequisites: [
        { type: 'skill', skillId: 'armorUnarmored', tier: 2 },
        { type: 'level', minimum: 6 },
      ],
      effects: [
        {
          target: 'ac_with_unarmored',
          operation: 'add',
          value: 1,
          sourceSkill: 'armorUnarmored',
          tier: 3,
        },
      ],
    },
  ],
};
