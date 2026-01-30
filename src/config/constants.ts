import { Attribute, AttributeMap } from '@/types/attributes';

export const TOTAL_STARTING_POINTS = 38;

export const ARRGS_BASELINE: AttributeMap = {
  str: 10,
  int: 10,
  wis: 10,
  dex: 10,
  con: 10,
  cha: 10,
};

export const ATTRIBUTE_ORDER: Attribute[] = [
  'str',
  'int',
  'wis',
  'dex',
  'con',
  'cha',
];

export const BASE_AC = 10;

export const NAME_LEVEL = 9;

export const MELEE_TYPES: string[] = [
  'slash',
  'pierce',
  'blunt',
  'energy',
] as const;

export const DAMAGE_TYPES = [
  'physical',
  'energy',
  'magic',
  'fire',
  'cold',
  'electric',
  'acid',
  'poison',
] as const;

type DamageType = (typeof DAMAGE_TYPES)[number];
export type DamageTarget = `damage.${DamageType}`;
export type ResistTarget = `resist.${DamageType}`;

export const STAT_TARGETS = [
  // 'hp',
  'hp_temp',
  'hp_flat',
  'attack_bonus_flat',
  'attack_bonus_basic',
  'attack_bonus_ranged_advanced',
  'attack_bonus_ranged_heavy',
  'attack_bonus_mounted',
  'attack_bonus_melee_2h',
  'attack_bonus_melee_energy',
  'ac_with_lightArmor',
  'ac_with_heavyArmor',
  'ac_with_powerArmor',
  'ac_with_unarmored',
  'ac_with_shield',
  'spellSlots',
  'ranged_attack_range',
  'piloting_check',
  'piloting_dodge',
] as const;

export type StatTarget =
  | (typeof STAT_TARGETS)[number]
  | ResistTarget
  | DamageTarget
  | WeaponProficiencyTarget;

const WEAPON_PROFICIENCY_IDS = [
  'basicWeapons',
  'rangedAdvancedWeapons',
  'rangedHeavyWeapons',
  'rangedMounted',
  'melee2hWeapons',
  'meleeEnergyWeapons',
] as const;
type WeaponProficiencyId = (typeof WEAPON_PROFICIENCY_IDS)[number];
export type WeaponProficiencyTarget = `proficiency.${WeaponProficiencyId}`;
