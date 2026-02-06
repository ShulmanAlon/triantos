import { DerivedStats } from '@/types/characters';

type LevelUpStatsPanelProps = {
  nextStats: DerivedStats | null;
  hpGain: number;
};

export const LevelUpStatsPanel = ({
  nextStats,
  hpGain,
}: LevelUpStatsPanelProps) => {
  if (!nextStats) return null;

  return (
    <div className="panel p-3 mt-4 space-y-2 text-sm text-gray-700">
      <p>
        <strong>HP:</strong> {nextStats.hp}
      </p>
      <p className="text-xs text-gray-600">+{hpGain} HP this level</p>
      <p>
        <strong>Base Attack Bonus:</strong> {nextStats.baseAttackBonus}
      </p>
      <p>
        <strong>Spells:</strong>{' '}
        {Object.entries(nextStats.spellSlots ?? {})
          .map(([lvl, slots]) => `Lvl ${lvl}: ${slots}`)
          .join(', ') || 'None'}
      </p>
    </div>
  );
};
