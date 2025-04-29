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
      skill: '+2',
      attackBonus: 1,
    },
    {
      level: 2,
      skill: 'human +1',
      attackBonus: 1,
      spells: { 1: 1 },
    },
    {
      level: 3,
      skill: '+1',
      attackBonus: 2,
      abilityPoint: true,
      spells: { 1: 2 },
    },
    // TODO: ... continue through level 18
  ],
};
