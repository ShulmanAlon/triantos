import { DerivedStats } from '@/types/characters';
import { ClassId } from '@/types/gameClass';

type LevelUpStatsPanelProps = {
  classId: ClassId;
  nextStats: DerivedStats | null;
  hpGain: number;
  spellResistanceCurrent: number;
  spellResistanceNext: number;
  baseSpellPowerCurrent: number | null;
  baseSpellPowerNext: number | null;
};

export const LevelUpStatsPanel = ({
  classId,
  nextStats,
  hpGain,
  spellResistanceCurrent,
  spellResistanceNext,
  baseSpellPowerCurrent,
  baseSpellPowerNext,
}: LevelUpStatsPanelProps) => {
  if (!nextStats) return null;
  const spellResistanceDelta = spellResistanceNext - spellResistanceCurrent;
  const hasBaseSpellPower =
    baseSpellPowerCurrent !== null && baseSpellPowerNext !== null;
  const baseSpellPowerDelta = hasBaseSpellPower
    ? baseSpellPowerNext - baseSpellPowerCurrent
    : 0;
  const maxSpellLevel = classId === 'MagicUser' ? 9 : classId === 'Cleric' ? 7 : 0;
  const displayedSpellLevels =
    maxSpellLevel > 0
      ? Array.from({ length: maxSpellLevel }, (_, idx) => idx + 1)
      : [];

  return (
    <div className="panel p-4 text-sm text-gray-700 h-full">
      <div className="section-rule">
        <h3 className="section-title">Projected Stats</h3>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-black/10 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-(--muted)">
            HP
          </div>
          <div className="text-lg font-bold">{nextStats.hp}</div>
          <div className="text-[11px] text-(--muted)">+{hpGain} this level</div>
        </div>
        <div className="rounded-lg border border-black/10 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-(--muted)">
            Base Attack Bonus
          </div>
          <div className="text-lg font-bold">{nextStats.baseAttackBonus}</div>
        </div>
        <div className="rounded-lg border border-black/10 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-(--muted)">
            Attacks / Round
          </div>
          <div className="text-lg font-bold">{nextStats.attacksPerRound}</div>
        </div>
        <div className="rounded-lg border border-black/10 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-(--muted)">
            Spell Resistance
          </div>
          <div className="text-lg font-bold">{spellResistanceNext}</div>
          <div className="text-[11px] text-(--muted)">
            {spellResistanceDelta >= 0 ? '+' : ''}
            {spellResistanceDelta} this level
          </div>
        </div>
        {hasBaseSpellPower && (
          <div className="rounded-lg border border-black/10 p-3 col-span-2">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-(--muted)">
              Base Spell Power
            </div>
            <div className="text-lg font-bold">{baseSpellPowerNext}</div>
            <div className="text-[11px] text-(--muted)">
              {baseSpellPowerDelta >= 0 ? '+' : ''}
              {baseSpellPowerDelta} this level
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <strong>Spell Slots:</strong>
        {displayedSpellLevels.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-xs">
              <tbody>
                <tr>
                  <th className="pr-3 py-1 text-left font-semibold text-(--muted) border-r border-b border-black/10">
                    Spell level
                  </th>
                  {displayedSpellLevels.map((level, index) => (
                    <td
                      key={level}
                      className={`px-2 py-1 text-center border-b border-black/10 ${
                        index < displayedSpellLevels.length - 1
                          ? 'border-r border-black/10'
                          : ''
                      }`}
                    >
                      {level}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th className="pr-3 py-1 text-left font-semibold text-(--muted) border-r border-black/10">
                    Allocation
                  </th>
                  {displayedSpellLevels.map((level, index) => (
                    <td
                      key={level}
                      className={`px-2 py-1 text-center ${
                        index < displayedSpellLevels.length - 1
                          ? 'border-r border-black/10'
                          : ''
                      }`}
                    >
                      {nextStats.spellSlots?.[level] ?? '-'}
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
