import { AttributeMap } from '@/types/attributes';
import { ClassId } from '@/types/gameClass';
import { GameItem } from '@/types/items';
import { RaceId } from '@/types/race';

export type ItemRestrictionContext = {
  classId?: ClassId;
  raceId?: RaceId;
  attributes?: AttributeMap;
  armorItem?: GameItem | null;
};

export const getItemRestrictionReasons = (
  item: GameItem,
  context: ItemRestrictionContext
): string[] => {
  const reasons: string[] = [];
  const { classId, raceId, attributes, armorItem } = context;
  const hasTag = (tag: string) => item.tags.includes(tag as never);
  const hasPowerArmor = armorItem?.tags.includes('powerArmor') ?? false;

  if (raceId && item.notAllowedRaces?.includes(raceId)) {
    reasons.push(`${raceId} cannot use this item.`);
  }
  if (classId && item.notAllowedClasses?.includes(classId)) {
    reasons.push(`${classId} cannot use this item.`);
  }

  if ((hasTag('slash') || hasTag('pierce')) && classId === 'Cleric') {
    reasons.push('Clerics cannot use slashing or piercing weapons.');
  }

  const isActualArmor =
    item.type === 'armor' &&
    (hasTag('lightArmor') || hasTag('heavyArmor') || hasTag('powerArmor'));
  if (isActualArmor && classId === 'MagicUser') {
    reasons.push('Magic Users cannot use armor.');
  }

  if (hasTag('large')) {
    if (raceId === 'Halfling' || raceId === 'Dwarf') {
      reasons.push('Large weapons cannot be used by Halflings or Dwarves.');
    }
    if (classId === 'MagicUser') {
      reasons.push('Large weapons cannot be used by Magic Users.');
    }
  }

  if (hasTag('heavy')) {
    if ((attributes?.str ?? 0) < 16) {
      reasons.push('Requires STR 16.');
    }
    if (classId === 'MagicUser') {
      reasons.push('Heavy weapons cannot be used by Magic Users.');
    }
    if ((raceId === 'Elf' || raceId === 'Halfling') && !hasPowerArmor) {
      reasons.push('Elves and Halflings require power armor.');
    }
  }

  if (hasTag('veryHeavy')) {
    if (classId === 'MagicUser') {
      reasons.push('Very heavy weapons cannot be used by Magic Users.');
    }
    if (!hasPowerArmor) {
      reasons.push('Requires power armor.');
    }
  }

  return reasons;
};

export const isItemAllowed = (
  item: GameItem,
  context: ItemRestrictionContext
): boolean => getItemRestrictionReasons(item, context).length === 0;
