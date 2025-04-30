import { GameClass } from '@/types/gameClass';

export const fighter: GameClass = {
  id: 'Fighter',
  primaryAttributes: { str: 13, dex: 11 },
  hpPerLevelToNine: 8,
  hpPerLevelFromTen: 3,
  allowedRaces: ['Human', 'Elf', 'Dwarf', 'Halfling'],
  progression: [
    {
      level: 1,
      skill: [{ onlyForRace: 'Human', skillPoints: 1 }, { skillPoints: 3 }],
      attackBonus: 2,
    },
    {
      level: 2,
      skill: [{ onlyForRace: 'Human', skillPoints: 1 }],
      attackBonus: 2,
    },
    {
      level: 3,
      skill: [{ skillPoints: 1 }],
      attackBonus: 3,
    },
    {
      level: 4,
      attackBonus: 3,
      abilityPoint: 1,
    },
    {
      level: 5,
      skill: [{ onlyForRace: 'Human', skillPoints: 1 }],
      attackBonus: 4,
    },
    {
      level: 6,
      skill: [{ skillPoints: 1 }],
      attackBonus: 4,
    },
    // TODO: ... continue through level 18
  ],
};
