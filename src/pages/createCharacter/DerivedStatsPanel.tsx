import { DerivedStats } from '@/types/characters';
import { ClassId } from '@/types/gameClass';

type DerivedStatsPanelProps = {
  classId?: ClassId;
  stats: DerivedStats | null;
  spellResistance: number;
  spellPowerBase: number | null;
};

export const DerivedStatsPanel = ({
  classId,
  stats,
  spellResistance,
  spellPowerBase,
}: DerivedStatsPanelProps) => {
  if (!stats) return null;
  const maxSpellLevel =
    classId === 'MagicUser' ? 9 : classId === 'Cleric' ? 7 : 0;
  const spellLevelRange =
    maxSpellLevel > 0
      ? Array.from({ length: maxSpellLevel }, (_, idx) => idx + 1)
      : [];

  return (
    <div className="panel p-3 mt-4 space-y-2 text-sm text-gray-700">
      <p>
        <strong>HP:</strong> {stats.hp}
      </p>
      <p>
        <strong>Base Attack Bonus:</strong> {stats.baseAttackBonus}
      </p>
      <p>
        <strong>Spell Resistance:</strong> {spellResistance}
      </p>
      <div className="space-y-1">
        <strong>Spells:</strong>
        {spellLevelRange.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-xs">
              <tbody>
                <tr>
                  <th className="pr-3 py-1 text-left font-semibold text-(--muted) border-r border-b border-black/10">
                    Spell level
                  </th>
                  {spellLevelRange.map((level, index) => (
                    <td
                      key={level}
                      className={`px-2 py-1 text-center border-b border-black/10 ${
                        index < spellLevelRange.length - 1
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
                  {spellLevelRange.map((level, index) => (
                    <td
                      key={level}
                      className={`px-2 py-1 text-center ${
                        index < spellLevelRange.length - 1
                          ? 'border-r border-black/10'
                          : ''
                      }`}
                    >
                      {stats.spellSlots?.[level] ?? '-'}
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
      {spellPowerBase !== null && (
        <p>
          <strong>Spell Power:</strong> {spellPowerBase}
        </p>
      )}
    </div>
  );
};
