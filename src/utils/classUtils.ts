import { classes } from '../data/classes';
import { classDictionary } from '../i18n/classes';
import { Attribute } from '../types/attributes';
import { ClassId, ClassLevel, GameClass } from '../types/gameClass';
import { Language } from '../types/i18n';
import { RaceId } from '../types/race';

export const getClassById = (
  classId: ClassId | undefined
): GameClass | undefined => {
  if (!classId) return undefined;
  return classes.find((cls) => cls.id === classId);
};

export const getClassNameById = (
  classId: ClassId,
  language: Language
): string => {
  return classDictionary[classId]?.[language]?.name ?? classId;
};

export const getAllowedRacesByClassId = (
  classId: ClassId | undefined
): RaceId[] | undefined => {
  if (!classId) return undefined;
  return getClassById(classId)?.allowedRaces;
};

export const getPrimaryAttributesByClassId = (
  classId: ClassId | undefined
): Partial<Record<Attribute, number>> | undefined => {
  if (!classId) return undefined;
  return getClassById(classId)?.primaryAttributes;
};

export const getClassLevelDataById = (
  classId: ClassId | undefined,
  level: number
): ClassLevel | undefined => {
  if (!classId) return undefined;
  return getClassById(classId)?.progression.find((l) => l.level === level);
};
