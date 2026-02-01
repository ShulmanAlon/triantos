import { GameClass } from '@/types/gameClass';

export const cleric: GameClass = {
  id: 'Cleric',
  primaryAttributes: { wis: 13, con: 11 },
  hpPerLevelToNine: 6,
  hpPerLevelFromTen: 2,
  allowedRaces: ['Human', 'Elf', 'Dwarf', 'Halfling'],
  progression: [
    {
      level: 1,
      skill: [
        { skillPoints: 1, skillPointType: 'utility' },
        { onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' },
      ],
      baseAttackBonus: 1,
    },
    {
      level: 2,
      skill: [{ skillPoints: 1, skillPointType: 'core' }],
      baseAttackBonus: 1,
      spells: { 1: 1 },
    },
    {
      level: 3,
      skill: [{ onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' }],
      baseAttackBonus: 2,
      spells: { 1: 2 },
    },
    {
      level: 4,
      skill: [{ skillPoints: 1, skillPointType: 'utility' }],
      baseAttackBonus: 2,
      abilityPoint: 1,
      spells: { 1: 2, 2: 1 },
    },
    {
      level: 5,
      skill: [{ skillPoints: 1, skillPointType: 'core' }],
      baseAttackBonus: 2,
      spells: { 1: 2, 2: 2 },
    },
    {
      level: 6,
      skill: [{ onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' }],
      baseAttackBonus: 3,
      spells: { 1: 3, 2: 2, 3: 1 },
    },
    {
      level: 7,
      skill: [{ skillPoints: 1, skillPointType: 'utility' }],
      baseAttackBonus: 3,
      spells: { 1: 3, 2: 2, 3: 2 },
    },
    {
      level: 8,
      skill: [{ skillPoints: 1, skillPointType: 'core' }],
      baseAttackBonus: 3,
      abilityPoint: 1,
      spells: { 1: 3, 2: 3, 3: 2, 4: 1 },
    },
    {
      level: 9,
      skill: [{ onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' }],
      baseAttackBonus: 4,
      spells: { 1: 3, 2: 3, 3: 2, 4: 2 },
    },
    {
      level: 10,
      skill: [{ skillPoints: 1, skillPointType: 'utility' }],
      baseAttackBonus: 4,
      spells: { 1: 4, 2: 3, 3: 3, 4: 2, 5: 1 },
    },
    {
      level: 11,
      skill: [{ skillPoints: 1, skillPointType: 'core' }],
      baseAttackBonus: 4,
      spells: { 1: 4, 2: 4, 3: 3, 4: 2, 5: 2 },
    },
    {
      level: 12,
      skill: [{ onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' }],
      baseAttackBonus: 5,
      abilityPoint: 1,
      spells: { 1: 4, 2: 4, 3: 3, 4: 3, 5: 2, 6: 1 },
    },
    // TODO: ... continue through level 18
  ],
};
