import { Attribute } from './attributes';

export interface GameClass {
  name: string;
  description: string;
  specialAbilities: string[];
  primaryStats: Attribute[];
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
