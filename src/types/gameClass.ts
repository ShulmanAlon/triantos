import { Attribute } from './attributes';

export interface GameClass {
  id: ClassId;
  name: string;
  description: string;
  specialAbilities: string[];
  primaryStats: Partial<Record<Attribute, number>>;
  progression: ClassLevel[];
  hpPerLevelToNine: number;
  hpPerLevelFromTen: number;
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
