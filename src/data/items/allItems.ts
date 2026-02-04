import { GameItem } from '@/types/items';
import * as armorItems from './armor/heavyArmor';
import * as meleeItems from './weapons/meleeWeapons';
import * as rangedItems from './weapons/rangedWeapons';

const collect = (group: Record<string, GameItem>): GameItem[] =>
  Object.values(group);

export const allItems: GameItem[] = [
  ...collect(armorItems as Record<string, GameItem>),
  ...collect(meleeItems as Record<string, GameItem>),
  ...collect(rangedItems as Record<string, GameItem>),
];
