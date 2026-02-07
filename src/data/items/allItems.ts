import { GameItem } from '@/types/items';
import * as armorItems from './armor/heavyArmor';
import * as lightArmorItems from './armor/lightArmor';
import * as powerArmorItems from './armor/powerArmor';
import * as shieldItems from './armor/shieldItems';
import * as energyShieldItems from './armor/energyShieldItems';
import * as meleeItems from './weapons/meleeWeapons';
import * as rangedItems from './weapons/rangedWeapons';

const collect = (group: Record<string, GameItem>): GameItem[] =>
  Object.values(group);

export const allItems: GameItem[] = [
  ...collect(armorItems as Record<string, GameItem>),
  ...collect(lightArmorItems as Record<string, GameItem>),
  ...collect(powerArmorItems as Record<string, GameItem>),
  ...collect(shieldItems as Record<string, GameItem>),
  ...collect(energyShieldItems as Record<string, GameItem>),
  ...collect(meleeItems as Record<string, GameItem>),
  ...collect(rangedItems as Record<string, GameItem>),
];
// TODO: Add more items (armor, weapons, utility) to expand loadout options.
