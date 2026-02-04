import { SkillEntity } from '@/types/skills';

export const armorLight: SkillEntity = {
  id: 'armorLight',
  name: 'Proficiency - Light Armor',
  family: 'defense',
  skillPointType: 'core',
  description: 'Allows and improves the use of light armor',
  forbiddenClasses: ['MagicUser'],
  tiers: [
    {
      tier: 1,
      name: 'Proficient',
      description: `Allows the use of:
    Leather Armor, Ceramic Armor, Small Shield`,
      deltaDescription: 'Unlock light armor use (Leather, Ceramic, Small Shield).',
      totalDescription: 'Can use light armor (Leather, Ceramic, Small Shield).',
      freeForClasses: [
        { classId: 'Fighter', atLevel: 1 },
        { classId: 'Cleric', atLevel: 1 },
      ],
      effects: [
        {
          target: 'ac_with_lightArmor',
          operation: 'enable',
          value: true,
          sourceSkill: 'armorLight',
          tier: 1,
        },
      ],
    },
    {
      tier: 2,
      name: 'Expert',
      description: `+1 AC when using light armor`,
      deltaDescription: '+1 AC when using light armor.',
      totalDescription: '+1 AC when using light armor.',
      prerequisites: [
        { type: 'skill', skillId: 'armorLight', tier: 1 },
        { type: 'level', minimum: 3 },
      ],
      effects: [
        {
          target: 'ac_with_lightArmor',
          operation: 'add',
          value: 1,
          sourceSkill: 'armorLight',
          tier: 2,
        },
      ],
    },
    {
      tier: 3,
      name: 'Master',
      description: `+1 AC when using light armor (+2 total)`,
      deltaDescription: '+1 AC when using light armor.',
      totalDescription: '+2 AC when using light armor.',
      prerequisites: [
        { type: 'skill', skillId: 'armorLight', tier: 2 },
        { type: 'level', minimum: 6 },
      ],
      effects: [
        {
          target: 'ac_with_lightArmor',
          operation: 'add',
          value: 1,
          sourceSkill: 'armorLight',
          tier: 3,
        },
      ],
    },
  ],
};
