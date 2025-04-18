import { Attribute } from '../types/attributes';

export const TOTAL_STARTING_POINTS = 38;

export const ARRGS_BASELINE: Record<Attribute, number> = {
  str: 10,
  dex: 10,
  con: 10,
  int: 10,
  wis: 10,
  cha: 10,
};

export const ATTRIBUTE_EFFECTS: Record<Attribute, string> = {
  str: 'Affects melee attack and damage.',
  dex: 'Affects ranged accuracy and AC.',
  con: 'Affects health and resistance.',
  int: 'Affects magic user spell power.',
  wis: 'Affects cleric spell power.',
  cha: 'Affects persuasion and leadership.',
};
