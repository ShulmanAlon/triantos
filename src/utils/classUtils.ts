import { classDictionary } from '../i18n/classes';
import { ClassId } from '../types/gameClass';
import { Language } from '../types/i18n';

export const getClassNameById = (
  classId: ClassId,
  language: Language
): string => {
  return classDictionary[classId]?.[language]?.name ?? classId;
};
