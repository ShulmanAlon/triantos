import { GameItem } from '@/types/items';
import { plasmaCutter } from './standardMeleeWeapons';
import { makeVariant } from '@/data/items/variants';

export const plasmaCutterPlusOne: GameItem = makeVariant(plasmaCutter, {
  id: 'plasmaCutterPlusOne',
  name: '+1 Plasma Cutter',
  variantTag: '+1',
  modifiers: [
    { target: 'attack_bonus_flat', operation: 'add', value: 1 },
    {
      target: 'damage.magic',
      operation: 'add',
      value: 1,
    },
  ],
});

export const plasmaCutterPlusTwoFiery: GameItem = makeVariant(plasmaCutter, {
  id: 'plasmaCutterPlusTwoFiery',
  name: 'Fiery +2 Plasma Cutter',
  variantTag: 'Fiery +2',
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
});
