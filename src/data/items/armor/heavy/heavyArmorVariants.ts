import { GameItem } from '@/types/items';
import { plateArmor } from './standardHeavyArmor';
import { makeVariant } from '@/data/items/variants';

export const plateArmorPlusOneFireResist: GameItem = makeVariant(plateArmor, {
  id: 'plateArmorPlusOneFireResist',
  name: 'Plate Armor +1, fire resistance',
  variantTag: '+1 Fire Resist',
  modifiers: [
    { target: 'ac_armor_base', operation: 'add', value: 6 },
    { target: 'ac_armor_magic', operation: 'add', value: 1 },
    { target: 'resist.fire', operation: 'multiply', value: 0.5 },
  ],
});
