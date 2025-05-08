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
