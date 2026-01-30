import { GameItem } from '@/types/items';

export const powerShotgun: GameItem = {
  id: 'powerShotgun',
  name: 'Power Shotgun',
  type: 'weapon',
  tags: ['ranged', 'energy', '2h', 'medium'],
  modifiers: [
    {
      target: 'damage.energy',
      operation: 'add',
      value: { diceRoll: 3, diceType: 6 },
    },
  ],
  requiresProficiency: ['basicWeapons'],
  ammo: 'energy',
  ammoConsumption: 3,
};

export const powerShotgunPlus2: GameItem = {
  ...powerShotgun,
  id: 'powerShotgunPlus2',
  name: '+2 Power Shotgun',
  modifiers: [
    { target: 'attack_bonus_flat', operation: 'add', value: 2 },
    {
      target: 'damage.magic',
      operation: 'add',
      value: 2,
    },
  ],
};
