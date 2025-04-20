import { AttributeState } from './attributes';

export interface Race {
  id: RaceId;
  baseStats: AttributeState;
}

export type RaceId = 'Human' | 'Elf' | 'Dwarf' | 'Halfling';
