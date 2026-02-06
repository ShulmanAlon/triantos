import { GameItem } from '@/types/items';

export const plasmaCutter: GameItem = {
  id: 'plasmaCutter',
  name: 'Plasma Cutter',
  type: 'weapon',
  tags: ['melee', 'energy', '2h', 'medium'],
  baseDamage: [
    {
      target: 'damage.energy',
      operation: 'add',
      value: { diceRoll: 2, diceType: 8 },
    },
  ],
  requiresProficiency: ['meleeEnergyWeapons'],
  ammo: 'energy',
  ammoConsumption: 2,
};

export const plasmaCutterPlusOne: GameItem = {
  ...plasmaCutter,
  id: 'plasmaCutterPlusOne',
  name: '+1 Plasma Cutter',
  modifiers: [
    { target: 'attack_bonus_flat', operation: 'add', value: 1 },
    {
      target: 'damage.magic',
      operation: 'add',
      value: 1,
    },
  ],
};

export const plasmaCutterPlusTwoFiery: GameItem = {
  ...plasmaCutter,
  id: 'plasmaCutterPlusTwoFiery',
  name: 'Fiery +2 Plasma Cutter',
  modifiers: [
    { target: 'attack_bonus_flat', operation: 'add', value: 2 },
    {
      target: 'damage.magic',
      operation: 'add',
      value: 2,
    },
    {
      target: 'damage.fire',
      operation: 'add',
      value: { diceRoll: 1, diceType: 6 },
    },
  ],
};
