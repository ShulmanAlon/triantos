export interface Race {
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
