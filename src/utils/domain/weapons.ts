import { ProficiencyId } from '@/config/constants';
import { GameItem } from '@/types/items';

export const DAMAGE_TAGS = ['energy', 'blunt', 'slash', 'pierce'] as const;
export type DamageTag = (typeof DAMAGE_TAGS)[number];
const DAMAGE_TAG_SET = new Set<DamageTag>(DAMAGE_TAGS);

const isDamageTag = (tag: string): tag is DamageTag => {
  return DAMAGE_TAG_SET.has(tag as DamageTag);
};

export const ARMOR_TYPES = [
  'heavyArmor',
  'lightArmor',
  'powerArmor',
  'unarmored',
] as const;
export type ArmorType = (typeof ARMOR_TYPES)[number];

export const getWeaponDamageTag = (item: GameItem | null): DamageTag => {
  if (!item) return 'blunt';
  const tag = item.tags.find(isDamageTag);
  return tag ?? 'blunt';
};

export const getArmorType = (item: GameItem | null): ArmorType => {
  if (!item) return 'unarmored';
  if (item.tags.includes('heavyArmor')) return 'heavyArmor';
  if (item.tags.includes('lightArmor')) return 'lightArmor';
  if (item.tags.includes('powerArmor')) return 'powerArmor';
  return 'unarmored';
};

export const getWeaponTypeLabel = (item: GameItem | null): string => {
  if (!item) return 'Fists';
  const isRanged = item.tags.includes('ranged');
  const isMelee = item.tags.includes('melee');
  const damageType = getWeaponDamageTag(item);
  if (isRanged) return `${damageType} ranged`;
  if (isMelee) return `${damageType} melee`;
  return 'weapon';
};

export const getRangedAttackType = (
  profs: ProficiencyId[]
): 'advanced' | 'heavy' | 'mounted' | 'basic' => {
  if (profs.includes('rangedAdvancedWeapons')) return 'advanced';
  if (profs.includes('rangedHeavyWeapons')) return 'heavy';
  if (profs.includes('rangedMounted')) return 'mounted';
  return 'basic';
};
