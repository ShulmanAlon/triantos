import { SkillEntity } from '@/types/skills';

export const rangedHeavyWeapons: SkillEntity = {
  id: 'rangedHeavyWeapons',
  name: 'Proficiency - Heavy Ranged Weapons',
  family: 'attack',
  skillPointType: 'core',
  description:
    'Allows proficient use of: Minigun, HVRL, Heavy Blaster Repeater',
  tiers: [
    {
      tier: 1,
      name: 'Proficient',
      description: 'Proficient with heavy ranged weapons (no -4 penalty)',
      prerequisites: [
        { type: 'level', minimum: 4 },
        { type: 'attribute', attribute: 'str', minimum: 15 },
        { type: 'attribute', attribute: 'dex', minimum: 11 },
      ],
      effects: [
        {
          target: 'proficiency.rangedHeavyWeapons',
          operation: 'enable',
          value: true,
          sourceSkill: 'rangedHeavyWeapons',
        },
      ],
    },
    {
      tier: 2,
      name: 'Expert',
      description: '+1 attack with heavy ranged weapons',
      prerequisites: [
        { type: 'skill', skillId: 'rangedHeavyWeapons', tier: 1 },
        { type: 'level', minimum: 10 },
      ],
      effects: [
        { target: 'attack_bonus_ranged_heavy', operation: 'add', value: 1 },
      ],
    },
    {
      tier: 3,
      name: 'Master',
      description: '+1 attack with heavy ranged weapons (+2 total)',
      prerequisites: [
        { type: 'skill', skillId: 'rangedHeavyWeapons', tier: 2 },
        { type: 'level', minimum: 14 },
      ],
      effects: [
        { target: 'attack_bonus_ranged_heavy', operation: 'add', value: 1 },
      ],
    },
  ],
};
