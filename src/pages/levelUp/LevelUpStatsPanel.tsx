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
  const spellSlots = Object.entries(nextStats.spellSlots ?? {})
    .map(([level, slots]) => [Number(level), slots] as const)
    .sort(([a], [b]) => a - b);

  return (
    <div className="panel p-3 space-y-2 text-sm text-gray-700">
      <p>
        <strong>HP:</strong> {nextStats.hp}
      </p>
      <p className="text-xs text-(--muted)">+{hpGain} HP this level</p>
      <p>
        <strong>Base Attack Bonus:</strong> {nextStats.baseAttackBonus}
      </p>
      <p>
        <strong>Attacks / Round:</strong> {nextStats.attacksPerRound}
      </p>
      <div className="space-y-1">
        <strong>Spells:</strong>
        {spellSlots.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-xs">
              <tbody>
                <tr>
                  <th className="pr-3 py-1 text-left font-semibold text-(--muted)">
                    Spell level
                  </th>
                  {spellSlots.map(([level]) => (
                    <td key={level} className="px-2 py-1 text-center">
                      {level}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th className="pr-3 py-1 text-left font-semibold text-(--muted)">
                    Allocation
                  </th>
                  {spellSlots.map(([level, slots]) => (
                    <td key={level} className="px-2 py-1 text-center">
                      {slots}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p>None</p>
        )}
      </div>
    </div>
  );
};
