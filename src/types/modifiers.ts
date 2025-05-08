import { StatTarget } from '@/config/constants';
import { ActiveAbilityEffect } from './skills';

export interface StatModifier {
  target: StatTarget;
  operation: 'add' | 'multiply' | 'enable' | 'grantActive' | 'override';
  value: number | boolean | DiceRoll | ActiveAbilityEffect;
  sourceSkill?: string;
  sourceItem?: string;
  tier?: number;
}

export type DiceRoll = { diceRoll: number; diceType: number };
