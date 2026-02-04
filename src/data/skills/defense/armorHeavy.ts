import { SkillEntity } from '@/types/skills';

export const armorHeavy: SkillEntity = {
  id: 'armorHeavy',
  name: 'Proficiency - Heavy Armor',
  family: 'defense',
  skillPointType: 'core',
  description:
    'Allows and improves the use of heavy armor, including: Chain Mail, Plate Armor, Ultron Nano Armor, Large Shield',
  forbiddenClasses: ['MagicUser'],
  tiers: [
    {
      tier: 1,
      name: 'Proficient',
      description: `Allows the use of heavy armor`,
      deltaDescription: 'Unlock heavy armor use.',
      totalDescription: 'Can use heavy armor.',
      prerequisites: [{ type: 'attribute', attribute: 'str', minimum: 13 }],
      freeForClasses: [{ classId: 'Fighter', atLevel: 1 }],
      effects: [
        {
          target: 'ac_with_heavyArmor',
          operation: 'enable',
          value: true,
          sourceSkill: 'armorHeavy',
          tier: 1,
        },
      ],
    },
    {
      tier: 2,
      name: 'Expert',
      description: `+1 AC when using heavy armor`,
      deltaDescription: '+1 AC when using heavy armor.',
      totalDescription: '+1 AC when using heavy armor.',
      prerequisites: [
        { type: 'skill', skillId: 'armorHeavy', tier: 1 },
        { type: 'level', minimum: 3 },
      ],
      effects: [
        {
          target: 'ac_with_heavyArmor',
          operation: 'add',
          value: 1,
          sourceSkill: 'armorHeavy',
          tier: 2,
        },
      ],
    },
    {
      tier: 3,
      name: 'Master',
      description: `+1 AC when using heavy armor (+2 total)`,
      deltaDescription: '+1 AC when using heavy armor.',
      totalDescription: '+2 AC when using heavy armor.',
      prerequisites: [
        { type: 'skill', skillId: 'armorHeavy', tier: 2 },
        { type: 'level', minimum: 6 },
      ],
      effects: [
        {
          target: 'ac_with_heavyArmor',
          operation: 'add',
          value: 1,
          sourceSkill: 'armorHeavy',
          tier: 3,
        },
      ],
    },
  ],
};
