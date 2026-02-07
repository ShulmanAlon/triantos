import { GameItem } from '@/types/items';

export const makeVariant = (
  base: GameItem,
  overrides: Partial<GameItem>
): GameItem => ({
  ...base,
  ...overrides,
  baseItemId: base.id,
});
