import { SkillEntity } from '@/types/skills';

export const advancedRangedWeapons: SkillEntity = {
  id: 'advancedRangedWeapons',
  name: 'Proficiency - Advanced Ranged Weapons',
  family: 'attack',
  description:
    'Allows and improves the use of advanced ranged weapons, including: Power Shotgun, Assault Rifle, Huntsman Rifle, Sniper Rifle',
  tiers: [
    {
      tier: 1,
      name: 'Proficient',
      description: 'Allows the use of advanced ranged weapons',
      effects: [
        {
          target: 'proficiency.rangedAdvancedWeapons',
          operation: 'enable',
          value: true,
          sourceSkill: 'advancedRangedWeapons',
        },
      ],
    },
    {
      tier: 2,
      name: 'Expert',
      description: '+1 attack with advanced ranged weapons',
      prerequisites: [{ type: 'level', minimum: 4 }],
      effects: [
        {
          target: 'proficiency.rangedAdvancedWeapons',
          operation: 'enable',
          value: true,
          sourceSkill: 'advancedRangedWeapons',
        },
        { target: 'attack_bonus_ranged_advanced', operation: 'add', value: 1 },
      ],
    },
    {
      tier: 3,
      name: 'Master',
      description: '+2 attack with advanced ranged weapons (+2 total)',
      prerequisites: [{ type: 'level', minimum: 8 }],
      effects: [
        {
          target: 'proficiency.rangedAdvancedWeapons',
          operation: 'enable',
          value: true,
          sourceSkill: 'advancedRangedWeapons',
        },
        { target: 'attack_bonus_ranged_advanced', operation: 'add', value: 2 },
      ],
    },
  ],
};
