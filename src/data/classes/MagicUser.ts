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
      skill: [{ onlyForRace: 'Human', skillPoints: 1 }, { skillPoints: 3 }],
      baseAttackBonus: 0,
      spells: { 1: 1 },
    },
    {
      level: 2,
      skill: [{ onlyForRace: 'Human', skillPoints: 1 }],
      baseAttackBonus: 0,
      spells: { 1: 2 },
    },
    {
      level: 3,
      skill: [{ skillPoints: 1 }],
      baseAttackBonus: 1,
      spells: { 1: 2, 2: 1 },
    },
    {
      level: 4,
      baseAttackBonus: 1,
      abilityPoint: 1,
      spells: { 1: 2, 2: 2 },
    },
    {
      level: 5,
      skill: [{ onlyForRace: 'Human', skillPoints: 1 }],
      baseAttackBonus: 1,
      spells: { 1: 3, 2: 2, 3: 1 },
    },
    {
      level: 6,
      skill: [{ skillPoints: 1 }],
      baseAttackBonus: 2,
      spells: { 1: 3, 2: 2, 3: 2 },
    },
    // TODO: ... continue through level 18
  ],
};
