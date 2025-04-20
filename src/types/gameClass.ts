import { Attribute } from './attributes';
import { RaceId } from './race';

export interface GameClass {
  id: ClassId;
  primaryAttributes: Partial<Record<Attribute, number>>;
  progression: ClassLevel[];
  hpPerLevelToNine: number;
  hpPerLevelFromTen: number;
  allowedRaces: RaceId[];
}

export type SpellSlots = Record<number, number>; // e.g., { 1: 2, 2: 1 }

export interface ClassLevel {
  level: number;
  skill?: string;
  abilityPoint?: boolean;
  attackBonus?: number;
  feature?: string;
  spells?: SpellSlots;
}

export type ClassId = 'Fighter' | 'Cleric' | 'MagicUser';
