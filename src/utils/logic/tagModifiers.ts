import { CharacterDerivedStats } from '@/types/characters';

/**
 * Generate all combinations of tags in hierarchical order
 * Example: ['melee', 'energy', '2h'] ->
 *   ['melee', 'melee.energy', 'melee.energy.2h']
 */
function generateTagCombos(tags: string[]): string[] {
  const sorted = [...tags].sort(); // sort to get consistent key order
  const combos: string[] = [];

  for (let i = 1; i <= sorted.length; i++) {
    const combo = sorted.slice(0, i).join('.');
    combos.push(combo);
  }

  return combos;
}

/**
 * Get cumulative modifier for all matching tag combinations
 */
export function getTagBasedModifier(
  baseKey: string,
  tags: string[],
  derived: CharacterDerivedStats
): number {
  const tagCombos = generateTagCombos(tags);

  return tagCombos.reduce((sum, combo) => {
    const fullKey = `${baseKey}.${combo}`; // e.g., attack_bonus.melee.energy.2h
    return sum + (derived.modifiers[fullKey] ?? 0);
  }, 0);
}
