import { GameItem } from '@/types/items';
import { powerShotgun } from './standardRangedWeapons';
import { makeVariant } from '@/data/items/variants';

export const powerShotgunPlus2: GameItem = makeVariant(powerShotgun, {
  id: 'powerShotgunPlus2',
  name: '+2 Power Shotgun',
  variantTag: '+2',
  modifiers: [
    { target: 'attack_bonus_flat', operation: 'add', value: 2 },
    {
      target: 'damage.magic',
      operation: 'add',
      value: 2,
    },
  ],
});
