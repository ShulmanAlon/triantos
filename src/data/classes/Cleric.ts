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
      skill: [{ onlyForRace: 'Human', skillPoints: 1 }, { skillPoints: 3 }],
      attackBonus: 1,
    },
    {
      level: 2,
      skill: [{ onlyForRace: 'Human', skillPoints: 1 }],
      attackBonus: 1,
      spells: { 1: 1 },
    },
    {
      level: 3,
      skill: [{ skillPoints: 1 }],
      attackBonus: 2,
      spells: { 1: 2 },
    },
    {
      level: 4,
      attackBonus: 2,
      abilityPoint: 1,
      spells: { 1: 2, 2: 1 },
    },
    {
      level: 5,
      skill: [{ onlyForRace: 'Human', skillPoints: 1 }],
      attackBonus: 2,
      spells: { 1: 2, 2: 2 },
    },
    {
      level: 6,
      skill: [{ skillPoints: 1 }],
      attackBonus: 3,
      spells: { 1: 3, 2: 2, 3: 1 },
    },
    // TODO: ... continue through level 18
  ],
};
