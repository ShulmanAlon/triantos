import { StatTarget } from '@/config/constants';
import { ActiveAbilityEffect } from './skills';
import { SkillId } from './skills';

export type StatOperation =
  | 'add'
  | 'multiply'
  | 'enable'
  | 'grantActive'
  | 'override';

export interface StatModifier {
  target: StatTarget;
  operation: StatOperation;
  value: number | boolean | DiceRoll | ActiveAbilityEffect;
  sourceSkill?: SkillId;
  sourceItem?: string;
  tier?: number;
}

export type DiceRoll = { diceRoll: number; diceType: number };

export const isDiceRoll = (value: unknown): value is DiceRoll => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'diceRoll' in value &&
    'diceType' in value &&
    typeof (value as DiceRoll).diceRoll === 'number' &&
    typeof (value as DiceRoll).diceType === 'number'
  );
};
