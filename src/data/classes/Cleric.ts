import { GameClass } from '../../types/gameClass';

export const Cleric: GameClass = {
  name: 'Cleric',
  description:
    'Arcane spellcaster who manipulates the elements and minds through spellbooks.',
  primaryStats: ['int', 'wis'],
  specialAbilities: [
    'Uses spellbooks',
    'Limited armor',
    'Learns arcane spells',
  ],
  hpPerLevelToNine: 6,
  hpPerLevelFromTen: 2,
  progression: [
    {
      level: 1,
      skill: '+2',
      attackBonus: 20,
    },
    {
      level: 2,
      skill: 'human +1',
      attackBonus: 30,
    },
    {
      level: 3,
      skill: '+1',
      attackBonus: 40,
      abilityPoint: true,
    },
    // ... continue through level 18 with parsed spells like:
    // spells: { 1: 2, 2: 1, ... }
  ],
};
