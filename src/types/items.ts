import { StatModifier } from './modifiers';
import { WeaponProficiencyId } from '@/config/constants';

export interface GameItem {
  id: string;
  name: string;
  type: ItemType; // 'armor', 'weapon', 'shield', 'utility', etc.
  slot?: EquipSlot; // 'body', 'hands', 'head', etc.
  tags: ItemTag[]; // 'lightArmor', 'energy', '2h', 'plasma', etc.
  baseDamage?: StatModifier[]; // Optional base weapon damage (inherited by variants)
  modifiers?: StatModifier[]; // Optional stat effects
  ammo?: AmmoType;
  ammoConsumption?: number;
  requiresProficiency?: ProficiencyId[]; // proficiency id needed
  activeAbilities?: string[]; // Optional references to active skills granted
  notes?: string; // Optional DM-written description or context
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

export type ProficiencyId =
  | WeaponProficiencyId
  | 'armorHeavy'
  | 'armorLight'
  | 'armorPower'
  | 'armorUnarmored'
  | 'shieldFortress';

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
