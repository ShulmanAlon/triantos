import { DerivedStats } from '@/types/characters';

type DerivedStatsPanelProps = {
  stats: DerivedStats | null;
};

export const DerivedStatsPanel = ({ stats }: DerivedStatsPanelProps) => {
  if (!stats) return null;

  return (
    <div className="panel p-3 mt-4 space-y-2 text-sm text-gray-700">
      <p>
        <strong>HP:</strong> {stats.hp}
      </p>
      <p>
        <strong>Base Attack Bonus:</strong> {stats.baseAttackBonus}
      </p>
      <p>
        <strong>Attacks / Round:</strong> {stats.attacksPerRound}
      </p>
      <p>
        <strong>Spells:</strong>{' '}
        {Object.entries(stats.spellSlots ?? {})
          .map(([lvl, slots]) => `Lvl ${lvl}: ${slots}`)
          .join(', ') || 'None'}
      </p>
    </div>
  );
};
