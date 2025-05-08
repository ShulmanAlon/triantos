import { CharacterDerivedStats } from '@/types/characters';
import { StatModifier } from '@/types/modifiers';
import { ActiveAbilityEffect } from '@/types/skills';

export function interpretEffects(
  effects: StatModifier[]
): CharacterDerivedStats {
  const derived: CharacterDerivedStats = {
    modifiers: {},
    toggles: {},
    activeAbilities: [],
  };

  for (const effect of effects) {
    const { target, operation, value } = effect;

    switch (operation) {
      case 'add':
        if (typeof value === 'number') {
          derived.modifiers[target] = (derived.modifiers[target] ?? 0) + value;
        }
        break;

      case 'override':
        if (typeof value === 'number') {
          derived.modifiers[target] = value;
        }
        break;

      case 'enable':
        if (typeof value === 'boolean') {
          derived.toggles[target] = value;
        }
        break;

      case 'grantActive':
        if (
          typeof value === 'object' &&
          value !== null &&
          'abilityName' in value &&
          'usageLimit' in value &&
          'actionType' in value
        ) {
          derived.activeAbilities.push(value as ActiveAbilityEffect);
        }
        break;

      // You can handle 'multiply' or others later
    }
  }

  return derived;
}
