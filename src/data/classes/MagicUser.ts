import { GameClass } from '../../types/gameClass';

export const MagicUser: GameClass = {
  name: 'Magic User',
  description:
    'Arcane spellcaster who manipulates the elements and minds through spellbooks.',
  primaryStats: ['int', 'wis'],
  specialAbilities: [
    'Uses spellbooks',
    'Limited armor',
    'Learns arcane spells',
  ],
  hpPerLevelToNine: 4,
  hpPerLevelFromTen: 1,
  progression: [
    {
      level: 1,
      skill: '+2',
      attackBonus: 0,
    },
    {
      level: 2,
      skill: 'human +1',
      attackBonus: 0,
    },
    {
      level: 3,
      skill: '+1',
      attackBonus: 1,
    },
    // ... continue through level 18 with parsed spells like:
    // spells: { 1: 2, 2: 1, ... }
  ],
};
