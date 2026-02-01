import { GameClass } from '@/types/gameClass';

export const magicUser: GameClass = {
  id: 'MagicUser',
  primaryAttributes: { int: 13, wis: 11 },
  hpPerLevelToNine: 4,
  hpPerLevelFromTen: 1,
  allowedRaces: ['Human', 'Elf', 'Halfling'],
  progression: [
    {
      level: 1,
      skill: [
        { skillPoints: 1, skillPointType: 'utility' },
        { onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' },
      ],
      baseAttackBonus: 0,
      spells: { 1: 1 },
    },
    {
      level: 2,
      skill: [{ skillPoints: 1, skillPointType: 'core' }],
      baseAttackBonus: 0,
      spells: { 1: 2 },
    },
    {
      level: 3,
      skill: [{ onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' }],
      baseAttackBonus: 1,
      spells: { 1: 2, 2: 1 },
    },
    {
      level: 4,
      skill: [{ skillPoints: 1, skillPointType: 'utility' }],
      baseAttackBonus: 1,
      abilityPoint: 1,
      spells: { 1: 2, 2: 2 },
    },
    {
      level: 5,
      skill: [{ skillPoints: 1, skillPointType: 'core' }],
      baseAttackBonus: 1,
      spells: { 1: 3, 2: 2, 3: 1 },
    },
    {
      level: 6,
      skill: [{ onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' }],
      baseAttackBonus: 2,
      spells: { 1: 3, 2: 2, 3: 2 },
    },
    {
      level: 7,
      skill: [{ skillPoints: 1, skillPointType: 'utility' }],
      baseAttackBonus: 2,
      spells: { 1: 3, 2: 3, 3: 2, 4: 1 },
    },
    {
      level: 8,
      skill: [{ skillPoints: 1, skillPointType: 'core' }],
      baseAttackBonus: 2,
      abilityPoint: 1,
      spells: { 1: 4, 2: 3, 3: 2, 4: 2 },
    },
    {
      level: 9,
      skill: [{ onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' }],
      baseAttackBonus: 2,
      spells: { 1: 4, 2: 3, 3: 3, 4: 2, 5: 1 },
    },
    {
      level: 10,
      skill: [{ skillPoints: 1, skillPointType: 'utility' }],
      baseAttackBonus: 3,
      spells: { 1: 4, 2: 4, 3: 3, 4: 2, 5: 2 },
    },
    {
      level: 11,
      skill: [{ skillPoints: 1, skillPointType: 'core' }],
      baseAttackBonus: 3,
      spells: { 1: 4, 2: 4, 3: 3, 4: 3, 5: 2, 6: 1 },
    },
    {
      level: 12,
      skill: [{ onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' }],
      baseAttackBonus: 3,
      abilityPoint: 1,
      spells: { 1: 5, 2: 4, 3: 4, 4: 3, 5: 2, 6: 2 },
    },
    // TODO: ... continue through level 18
  ],
};
