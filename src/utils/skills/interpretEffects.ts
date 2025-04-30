import { CharacterDerivedStats } from '@/types/characters';
import { EffectType } from '@/types/skills';

export function interpretEffects(effects: EffectType[]): CharacterDerivedStats {
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
        if (typeof value === 'object') {
          derived.activeAbilities.push(value);
        }
        break;

      // You can handle 'multiply' or others later
    }
  }

  return derived;
}
