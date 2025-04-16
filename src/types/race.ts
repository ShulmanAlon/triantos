export interface Race {
  name: string;
  description: string;
  baseStats: {
    STR: number;
    DEX: number;
    WIS: number;
    INT: number;
    CON: number;
    CHA: number;
  };
  specialAbilities: string[];
  restrictions: string[];
}
