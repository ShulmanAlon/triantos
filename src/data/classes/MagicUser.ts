import { GameClass } from '../../types/gameClass';

export const magicUser: GameClass = {
  id: 'MagicUser',
  name: 'Magic User',
  description:
    'Arcane spellcaster who uses a spellbook to cast powerful spells.',
  primaryAttributes: { int: 13, wis: 11 },
  specialAbilities: ['Arcane spellcasting'],
  hpPerLevelToNine: 4,
  hpPerLevelFromTen: 1,
  allowedRaces: ['Human', 'Elf', 'Halfling'],
  progression: [
    {
      level: 1,
      skill: '+2',
      attackBonus: 0,
      spells: { 1: 1 },
    },
    {
      level: 2,
      skill: 'human +1',
      attackBonus: 0,
      spells: { 1: 2 },
    },
    {
      level: 3,
      skill: '+1',
      attackBonus: 1,
      abilityPoint: true,
      spells: { 1: 2, 2: 1 },
    },
    // TODO: ... continue through level 18
  ],
};
