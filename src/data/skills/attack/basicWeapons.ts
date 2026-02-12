import { SkillEntity } from '@/types/skills';
import { weaponListForProficiency } from './weaponSkillDescriptions';

const basicWeaponsList = weaponListForProficiency('basicWeapons');

export const basicWeapons: SkillEntity = {
  id: 'basicWeapons',
  name: 'Proficiency - Basic Weapons',
  family: 'attack',
  skillPointType: 'core',
  description:
    `Improves the use of basic weapons, including: ${basicWeaponsList}`,
  tiers: [
    {
      tier: 1,
      name: 'Proficient',
      description: 'Proficient with basic weapons (no -4 penalty)',
      deltaDescription: 'Proficient with basic weapons (no -4 penalty).',
      totalDescription: 'Proficient with basic weapons (no -4 penalty).',
      effects: [
        {
          target: 'proficiency.basicWeapons',
          operation: 'enable',
          value: true,
          sourceSkill: 'basicWeapons',
        },
      ],
      freeForClasses: [
        { classId: 'Fighter', atLevel: 1 },
        { classId: 'Cleric', atLevel: 1 },
        { classId: 'MagicUser', atLevel: 1 },
      ],
    },
    {
      tier: 2,
      name: 'Expert',
      description: '+1 attack with basic weapons',
      deltaDescription: '+1 attack with basic weapons.',
      totalDescription: '+1 attack with basic weapons.',
      prerequisites: [
        { type: 'skill', skillId: 'basicWeapons', tier: 1 },
        { type: 'level', minimum: 5 },
      ],
      effects: [{ target: 'attack_bonus_basic', operation: 'add', value: 1 }],
    },
    {
      tier: 3,
      name: 'Master',
      description: '+1 attack with basic weapons (+2 total)',
      deltaDescription: '+1 attack with basic weapons.',
      totalDescription: '+2 attack with basic weapons.',
      prerequisites: [
        { type: 'skill', skillId: 'basicWeapons', tier: 2 },
        { type: 'level', minimum: 8 },
      ],
      effects: [{ target: 'attack_bonus_basic', operation: 'add', value: 1 }],
    },
  ],
};
