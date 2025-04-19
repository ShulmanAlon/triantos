export interface Race {
  id: RaceId;
  name: string;
  description: string;
  baseStats: {
    str: number;
    dex: number;
    wis: number;
    int: number;
    con: number;
    cha: number;
  };
  specialAbilities: string[];
  restrictions: string[];
}

export type RaceId = 'Human' | 'Elf' | 'Dwarf' | 'Halfling';
