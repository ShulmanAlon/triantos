import { AttributeMap } from './attributes';

export interface Race {
  id: RaceId;
  baseStats: AttributeMap;
}

export type RaceId = 'Human' | 'Elf' | 'Dwarf' | 'Halfling';
