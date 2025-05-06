import { StatTarget } from '@/config/constants';
import { DiceRoll, StatModifier } from './modifiers';

export interface GameItem {
  id: string;
  name: string;
  type: ItemType; // 'armor', 'weapon', 'shield', 'utility', etc.
  slot?: EquipSlot; // 'body', 'hands', 'head', etc.
  tags: ItemTag[]; // 'lightArmor', 'energy', '2h', 'plasma', etc.
  modifiers?: StatModifier[]; // Optional stat effects
  ammo?: AmmoType;
  ammoConsumption?: number;
  requiresProficiency?: string[]; // proficiency id needed
  activeAbilities?: string[]; // Optional references to active skills granted
  notes?: string; // Optional DM-written description or context
}

export interface ItemModifier {
  target: StatTarget; // e.g., 'ac_with_lightArmor', 'hp', 'attack_bonus.melee'
  operation: 'add' | 'multiply' | 'enable';
  value: number | boolean | DiceRoll;
  source?: string; // Optional label for UI (e.g., 'Gloves of the Ox')
}

export type AmmoType = 'arrow' | 'energy' | 'self';

export interface CharacterInventory {
  items: GameItemWithEquipState[];
}

export interface GameItemWithEquipState extends GameItem {
  isEquipped?: boolean; // Marks gear for gear slots (head, robe, etc.)
  equippedMeleeSlot?: 'melee1' | 'melee2'; // Optional: for weapon presets
  equippedRangedSlot?: 'ranged1' | 'ranged2'; // Optional: for ranged presets
}

export type ItemType =
  | 'armor'
  | 'weapon'
  | 'shield'
  | 'utility'
  | 'ring'
  | 'headgear'
  | 'feet'
  | 'arms'
  | 'robe';

export type EquipSlot =
  | 'body'
  | 'robe'
  | 'feet'
  | 'hands'
  | 'ring1'
  | 'ring2'
  | 'head'
  | 'utility'
  | 'melee1'
  | 'melee2'
  | 'ranged1'
  | 'ranged2'
  | 'shield';

export const ITEM_TAGS = [
  'lightArmor',
  'heavyArmor',
  'powerArmor',
  'clothing',
  'melee',
  'ranged',
  '1h',
  '2h',
  'energy',
  'blunt',
  'slash',
  'pierce',
  'small',
  'medium',
  'large',
  'heavy',
  'custom',
] as const;

export type ItemTag = (typeof ITEM_TAGS)[number];
