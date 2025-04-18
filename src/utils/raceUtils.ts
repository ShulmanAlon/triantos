import { races } from '../data/races';
import { RaceId } from '../types/race';

export function getRaceNameById(raceId: RaceId): string {
  const found = races.find((race) => race.id === raceId);
  return found ? found.name : raceId; // fallback to ID if not found
}
