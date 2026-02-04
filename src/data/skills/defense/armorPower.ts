import { SkillEntity } from '@/types/skills';

export const armorPower: SkillEntity = {
  id: 'armorPower',
  name: 'Proficiency - Power Armor',
  family: 'defense',
  skillPointType: 'core',
  description: 'Allows and improves the use of Power-Armor',
  forbiddenClasses: ['MagicUser'],
  tiers: [
    {
      tier: 1,
      name: 'Proficient',
      description: `Allows the use of Power-Armor`,
      deltaDescription: 'Unlock Power-Armor use.',
      totalDescription: 'Can use Power-Armor.',
      prerequisites: [
        { type: 'attribute', attribute: 'str', minimum: 15 },
        { type: 'attribute', attribute: 'con', minimum: 15 },
        { type: 'level', minimum: 10 },
      ],
      effects: [
        {
          target: 'ac_with_powerArmor',
          operation: 'enable',
          value: true,
          sourceSkill: 'armorPower',
          tier: 1,
        },
      ],
    },
    {
      tier: 2,
      name: 'Expert',
      description: `+2 AC when using Power-Armor`,
      deltaDescription: '+2 AC when using Power-Armor.',
      totalDescription: '+2 AC when using Power-Armor.',
      prerequisites: [
        { type: 'skill', skillId: 'armorPower', tier: 1 },
        { type: 'level', minimum: 14 },
      ],
      effects: [
        {
          target: 'ac_with_powerArmor',
          operation: 'add',
          value: 2,
          sourceSkill: 'armorPower',
          tier: 2,
        },
      ],
    },
  ],
};
