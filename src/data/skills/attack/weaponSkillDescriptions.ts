import { allItems } from '@/data/items/allItems';
import {
  WEAPON_ITEM_IDS_BY_PROFICIENCY,
  WeaponItemId,
} from '@/data/items/weapons/weaponProficiencyMap';

type WeaponMappedProficiencyId = keyof typeof WEAPON_ITEM_IDS_BY_PROFICIENCY;

const WEAPON_NAME_BY_ID = new Map<WeaponItemId, string>(
  allItems.map((item) => [item.id as WeaponItemId, item.name])
);

export const weaponListForProficiency = (
  proficiencyId: WeaponMappedProficiencyId
): string =>
  WEAPON_ITEM_IDS_BY_PROFICIENCY[proficiencyId]
    .map((itemId: WeaponItemId) => WEAPON_NAME_BY_ID.get(itemId) ?? itemId)
    .join(', ');
