import { races } from '../data/races';
import { raceDictionary } from '../i18n/races';
import { AttributeMap } from '../types/attributes';
import { Language } from '../types/i18n';
import { Race, RaceId } from '../types/race';

export const getRaceNameById = (
  raceId: RaceId | undefined,
  language: Language
): string => {
  if (!raceId) return '';
  return raceDictionary[raceId][language].name;
};

export const getRaceById = (raceId: RaceId | undefined): Race | undefined => {
  if (!raceId) return undefined;
  return races.find((race) => race.id === raceId);
};

export const getBaseAttributesByRaceId = (
  raceId?: RaceId
): AttributeMap | undefined => {
  if (!raceId) return undefined;
  return getRaceById(raceId)?.baseStats;
};

export const getRaceDescriptionById = (
  raceId: RaceId | undefined,
  language: Language
): string => {
  if (!raceId) return '';
  return raceDictionary[raceId][language].description;
};

export const getRaceSpecialAbilitiesById = (
  raceId: RaceId | undefined,
  language: Language
): string[] => {
  if (!raceId) return [''];
  return raceDictionary[raceId][language].specialAbilities;
};

export const getRaceRestrictionsById = (
  raceId: RaceId | undefined,
  language: Language
): string[] => {
  if (!raceId) return [''];
  return raceDictionary[raceId][language].restrictions;
};
