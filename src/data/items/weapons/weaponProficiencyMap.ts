import { WeaponProficiencyId } from '@/config/constants';

const BASIC_WEAPON_ITEM_IDS = [
  'unarmed',
  'knife',
  'dagger',
  'mace',
  'hammer',
  'sword',
  'axe',
  'bowCrossbow',
  'energyPistol',
  'liberatorHandgun',
  'creosantRifle',
  'dimpleGrenade',
] as const;

const MELEE_2H_WEAPON_ITEM_IDS = [
  'warhammer',
  'battleaxe',
  'longsword',
  'greatsword',
] as const;

const MELEE_ENERGY_WEAPON_ITEM_IDS = ['powerFist', 'plasmaCutter'] as const;

const RANGED_ADVANCED_WEAPON_ITEM_IDS = [
  'assaultRifle',
  'huntsmanRifle',
  'sniperRifle',
  'powerShotgun',
] as const;

const RANGED_HEAVY_WEAPON_ITEM_IDS = [
  'minigun',
  'heavyBlasterRepeater',
  'hvrl',
] as const;

const mapItemIdsToProficiency = <Ids extends readonly string[]>(
  itemIds: Ids,
  proficiency: WeaponProficiencyId
) =>
  Object.fromEntries(
    itemIds.map((itemId) => [itemId, proficiency])
  ) as Record<Ids[number], WeaponProficiencyId>;

export const WEAPON_ITEM_IDS_BY_PROFICIENCY = {
  basicWeapons: BASIC_WEAPON_ITEM_IDS,
  melee2hWeapons: MELEE_2H_WEAPON_ITEM_IDS,
  meleeEnergyWeapons: MELEE_ENERGY_WEAPON_ITEM_IDS,
  rangedAdvancedWeapons: RANGED_ADVANCED_WEAPON_ITEM_IDS,
  rangedHeavyWeapons: RANGED_HEAVY_WEAPON_ITEM_IDS,
} as const;

export const WEAPON_PROFICIENCY_BY_ITEM_ID = {
  ...mapItemIdsToProficiency(
    WEAPON_ITEM_IDS_BY_PROFICIENCY.basicWeapons,
    'basicWeapons'
  ),
  ...mapItemIdsToProficiency(
    WEAPON_ITEM_IDS_BY_PROFICIENCY.melee2hWeapons,
    'melee2hWeapons'
  ),
  ...mapItemIdsToProficiency(
    WEAPON_ITEM_IDS_BY_PROFICIENCY.meleeEnergyWeapons,
    'meleeEnergyWeapons'
  ),
  ...mapItemIdsToProficiency(
    WEAPON_ITEM_IDS_BY_PROFICIENCY.rangedAdvancedWeapons,
    'rangedAdvancedWeapons'
  ),
  ...mapItemIdsToProficiency(
    WEAPON_ITEM_IDS_BY_PROFICIENCY.rangedHeavyWeapons,
    'rangedHeavyWeapons'
  ),
} as const;

export type WeaponItemId = keyof typeof WEAPON_PROFICIENCY_BY_ITEM_ID;

export const requiresWeaponProficiency = (
  itemId: WeaponItemId
): WeaponProficiencyId[] => [WEAPON_PROFICIENCY_BY_ITEM_ID[itemId]];
