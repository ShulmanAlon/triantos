import { GameItem } from '@/types/items';

export const plasmaCutter: GameItem = {
  id: 'plasmaCutter',
  name: 'Plasma Cutter',
  type: 'weapon',
  tags: ['melee', 'energy', '2h', 'medium'],
  modifiers: [
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

export const plasmaCutterPlusTwoFiery: GameItem = {
  // a +2 plasmaCutter with fire enchantment
  id: 'plasmaCutterPlusTwoFiery',
  name: 'Fiery +2 Plasma Cutter',
  type: 'weapon',
  tags: ['melee', 'energy', '2h', 'medium'],
  modifiers: [
    {
      target: 'damage.energy',
      operation: 'add',
      value: { diceRoll: 2, diceType: 8 },
    },
    { target: 'attack_bonus', operation: 'add', value: 2 },
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
  requiresProficiency: ['meleeEnergyWeapons'],
  ammo: 'energy',
  ammoConsumption: 2,
};
