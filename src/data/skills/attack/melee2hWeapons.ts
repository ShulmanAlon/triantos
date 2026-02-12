import { SkillEntity } from '@/types/skills';
import { weaponListForProficiency } from './weaponSkillDescriptions';

const melee2hWeaponsList = weaponListForProficiency('melee2hWeapons');

export const melee2hWeapons: SkillEntity = {
  id: 'melee2hWeapons',
  name: 'Proficiency - 2-Handed Melee Weapons',
  family: 'attack',
  skillPointType: 'core',
  description: `Allows proficient use of: ${melee2hWeaponsList}`,
  tiers: [
    {
      tier: 1,
      name: 'Proficient',
      description: 'Proficient with 2-handed melee weapons (no -4 penalty)',
      deltaDescription:
        'Proficient with 2-handed melee weapons (no -4 penalty).',
      totalDescription:
        'Proficient with 2-handed melee weapons (no -4 penalty).',
      prerequisites: [{ type: 'attribute', attribute: 'str', minimum: 13 }],
      effects: [
        {
          target: 'proficiency.melee2hWeapons',
          operation: 'enable',
          value: true,
          sourceSkill: 'melee2hWeapons',
        },
      ],
    },
    {
      tier: 2,
      name: 'Expert',
      description: '+1 attack with 2-handed melee weapons',
      deltaDescription: '+1 attack with 2-handed melee weapons.',
      totalDescription: '+1 attack with 2-handed melee weapons.',
      prerequisites: [
        { type: 'skill', skillId: 'melee2hWeapons', tier: 1 },
        { type: 'level', minimum: 5 },
      ],
      effects: [
        { target: 'attack_bonus_melee_2h', operation: 'add', value: 1 },
      ],
    },
    {
      tier: 3,
      name: 'Master',
      description: '+1 attack with 2-handed melee weapons (+2 total)',
      deltaDescription: '+1 attack with 2-handed melee weapons.',
      totalDescription: '+2 attack with 2-handed melee weapons.',
      prerequisites: [
        { type: 'skill', skillId: 'melee2hWeapons', tier: 2 },
        { type: 'level', minimum: 8 },
        { type: 'attribute', attribute: 'str', minimum: 15 },
      ],
      effects: [
        { target: 'attack_bonus_melee_2h', operation: 'add', value: 1 },
      ],
    },
  ],
};
