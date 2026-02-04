import { SkillEntity } from '@/types/skills';

export const rangedAdvancedWeapons: SkillEntity = {
  id: 'rangedAdvancedWeapons',
  name: 'Proficiency - Advanced Ranged Weapons',
  family: 'attack',
  skillPointType: 'core',
  description:
    'Allows and improves the use of advanced ranged weapons, including: Power Shotgun, Assault Rifle, Huntsman Rifle, Sniper Rifle',
  tiers: [
    {
      tier: 1,
      name: 'Proficient',
      description: 'Allows the use of advanced ranged weapons',
      deltaDescription: 'Unlock advanced ranged weapons.',
      totalDescription: 'Can use advanced ranged weapons.',
      effects: [
        {
          target: 'proficiency.rangedAdvancedWeapons',
          operation: 'enable',
          value: true,
          sourceSkill: 'rangedAdvancedWeapons',
        },
      ],
    },
    {
      tier: 2,
      name: 'Expert',
      description: '+1 attack with advanced ranged weapons',
      deltaDescription: '+1 attack with advanced ranged weapons.',
      totalDescription: '+1 attack with advanced ranged weapons.',
      prerequisites: [
        { type: 'skill', skillId: 'rangedAdvancedWeapons', tier: 1 },
        { type: 'level', minimum: 4 },
      ],
      effects: [
        { target: 'attack_bonus_ranged_advanced', operation: 'add', value: 1 },
      ],
    },
    {
      tier: 3,
      name: 'Master',
      description: '+1 attack with advanced ranged weapons (+2 total)',
      deltaDescription: '+1 attack with advanced ranged weapons.',
      totalDescription: '+2 attack with advanced ranged weapons.',
      prerequisites: [
        { type: 'skill', skillId: 'rangedAdvancedWeapons', tier: 2 },
        { type: 'level', minimum: 8 },
      ],
      effects: [
        { target: 'attack_bonus_ranged_advanced', operation: 'add', value: 1 },
      ],
    },
  ],
};
