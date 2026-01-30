import { SkillEntity } from '@/types/skills';

export const heavyArmor: SkillEntity = {
  id: 'heavyArmor',
  name: 'Proficiency - Heavy Armor',
  family: 'defense',
  description:
    'Allows and improves the use of heavy armor, including: Chain Mail, Plate Armor, Ultron Nano Armor, Large Shield',
  forbiddenClasses: ['MagicUser'],
  tiers: [
    {
      tier: 1,
      name: 'Proficient',
      description: `Allows the use of heavy armor`,
      prerequisites: [{ type: 'attribute', attribute: 'str', minimum: 13 }],
      freeForClasses: [{ classId: 'Fighter', atLevel: 1 }],
      effects: [
        {
          target: 'ac_with_heavyArmor',
          operation: 'enable',
          value: true,
          sourceSkill: 'heavyArmor',
          tier: 1,
        },
      ],
    },
    {
      tier: 2,
      name: 'Expert',
      description: `+1 AC when using heavy armor`,
      prerequisites: [
        { type: 'skill', skillId: 'heavyArmor', tier: 1 },
        { type: 'level', minimum: 3 },
      ],
      effects: [
        {
          target: 'ac_with_heavyArmor',
          operation: 'add',
          value: 1,
          sourceSkill: 'heavyArmor',
          tier: 2,
        },
      ],
    },
    {
      tier: 3,
      name: 'Master',
      description: `+1 AC when using heavy armor (+2 total)`,
      prerequisites: [
        { type: 'skill', skillId: 'heavyArmor', tier: 2 },
        { type: 'level', minimum: 6 },
      ],
      effects: [
        {
          target: 'ac_with_heavyArmor',
          operation: 'add',
          value: 1,
          sourceSkill: 'heavyArmor',
          tier: 3,
        },
      ],
    },
  ],
};
