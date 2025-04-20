import { races } from '../data/races';
import { raceDictionary } from '../i18n/races';
import { AttributeState } from '../types/attributes';
import { Language } from '../types/i18n';
import { Race, RaceId } from '../types/race';

export const getRaceNameById = (
  raceId: RaceId | undefined,
  language: Language
): string => {
  if (!raceId) return '';
  return raceDictionary[raceId][language].name;
};

export function getRaceById(raceId: RaceId): Race | undefined {
  return races.find((race) => race.id === raceId);
}

export function getBaseAttributesByRaceId(
  raceId?: RaceId
): AttributeState | undefined {
  if (!raceId) return undefined;
  return getRaceById(raceId)?.baseStats;
}
