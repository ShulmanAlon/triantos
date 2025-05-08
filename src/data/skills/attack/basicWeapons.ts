import { SkillEntity } from '@/types/skills';

export const basicWeapons: SkillEntity = {
  id: 'basicWeapons',
  name: 'Proficiency - Basic Weapons',
  family: 'attack',
  description:
    'Improves the use of basic weapons, including: Knife, Dagger, Mace, Hammer, Sword, Axe, Bow, Crossbow, Energy Pistol, Liberator Handgun, Creosant Rifle, Dimple Grenade',
  tiers: [
    {
      tier: 1,
      name: 'Proficient',
      description: 'Allows the use of basic weapons',
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
      prerequisites: [{ type: 'level', minimum: 4 }],
      effects: [
        {
          target: 'proficiency.basicWeapons',
          operation: 'enable',
          value: true,
          sourceSkill: 'basicWeapons',
        },
        { target: 'attack_bonus_basic', operation: 'add', value: 1 },
      ],
    },
    {
      tier: 3,
      name: 'Master',
      description: '+2 attack with basic weapons (+2 total)',
      prerequisites: [{ type: 'level', minimum: 8 }],
      effects: [
        {
          target: 'proficiency.basicWeapons',
          operation: 'enable',
          value: true,
          sourceSkill: 'basicWeapons',
        },
        { target: 'attack_bonus_basic', operation: 'add', value: 2 },
      ],
    },
  ],
};
