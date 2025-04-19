import { GameClass } from '../../types/gameClass';

export const fighter: GameClass = {
  id: 'Fighter',
  name: 'Fighter',
  description:
    'Melee and ranged damage dealer and tank, excells in battle and versatile.',
  primaryAttributes: { str: 13, dex: 11 },
  specialAbilities: [],
  hpPerLevelToNine: 8,
  hpPerLevelFromTen: 3,
  allowedRaces: ['Human', 'Elf', 'Dwarf', 'Halfling'],
  progression: [
    {
      level: 1,
      skill: '+3',
      attackBonus: 2,
    },
    {
      level: 2,
      skill: 'human +1',
      attackBonus: 2,
    },
    {
      level: 3,
      skill: '+1',
      attackBonus: 3,
      abilityPoint: true,
    },
    // TODO: ... continue through level 18
  ],
};
