import { Attribute } from './attributes';
import { RaceId } from './race';
import { SkillPointType } from './skills';

export interface GameClass {
  id: ClassId;
  primaryAttributes: Partial<Record<Attribute, number>>;
  progression: ClassLevel[];
  hpPerLevelToNine: number;
  hpPerLevelFromTen: number;
  allowedRaces: RaceId[];
}

type SpellSlots = Record<number, number>; // e.g., { 1: 2, 2: 1 }

export interface ClassLevel {
  level: number;
  skill?: {
    skillPoints: number;
    skillPointType: SkillPointType;
    onlyForClass?: ClassId;
    onlyForRace?: RaceId;
  }[];
  abilityPoint?: number;
  baseAttackBonus?: number;
  attacksPerRound?: number;
  spellPower?: number;
  feature?: string;
  spells?: SpellSlots;
}

export type ClassId = 'Fighter' | 'Cleric' | 'MagicUser';
