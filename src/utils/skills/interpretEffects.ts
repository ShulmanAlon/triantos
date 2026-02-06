import { CharacterDerivedStats } from '@/types/characters';
import { StatModifier } from '@/types/modifiers';
import { ActiveAbilityEffect } from '@/types/skills';
import { isDiceRoll } from '@/types/modifiers';

export function interpretEffects(
  effects: StatModifier[]
): CharacterDerivedStats {
  const derived: CharacterDerivedStats = {
    modifiers: {},
    toggles: {},
    activeAbilities: [],
  };
  const activeByName = new Map<string, ActiveAbilityEffect>();

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
          const active = value as ActiveAbilityEffect;
          if (activeByName.has(active.abilityName)) {
            activeByName.delete(active.abilityName);
          }
          activeByName.set(active.abilityName, active);
        }
        break;

      case 'multiply':
        if (typeof value === 'number') {
          const current = derived.modifiers[target];
          const base = typeof current === 'number' ? current : 0;
          derived.modifiers[target] = base * value;
        }
        break;

      default:
        break;
    }
  }

  if (activeByName.size > 0) {
    derived.activeAbilities = Array.from(activeByName.values());
  }

  return derived;
}
