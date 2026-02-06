import { SkillPointType, TierData } from '@/types/skills';
import { Button } from '@/components/ui/Button';

type TierRowProps = {
  tier: TierData;
  statusLabel: string;
  isSelected: boolean;
  availability: {
    status: 'available' | 'locked' | 'ineligible' | 'acquired';
    reasons: string[];
    canAfford: boolean;
  };
  prereqLabels: { label: string; met: boolean }[];
  pointRequirement: string | null;
  spendOptions: SkillPointType[];
  disableOption: (option: SkillPointType) => boolean;
  defaultSpendType: SkillPointType;
  canUseSpendType: boolean;
  onSpendTypeChange: (value: SkillPointType) => void;
  onAdd: () => void;
  onRemove: () => void;
};

export const SkillTierRow = ({
  tier,
  statusLabel,
  isSelected,
  availability,
  prereqLabels,
  pointRequirement,
  spendOptions,
  disableOption,
  defaultSpendType,
  canUseSpendType,
  onSpendTypeChange,
  onAdd,
  onRemove,
}: TierRowProps) => {
  return (
    <div className="flex items-start justify-between gap-4 border rounded-xl p-3">
      <div>
        <div className="font-medium text-gray-800">Tier {tier.tier}</div>
        {(tier.deltaDescription ?? tier.description) && (
          <div className="text-xs text-gray-600">
            {tier.deltaDescription ?? tier.description}
          </div>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-(--muted)">
          <span
            className={`rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide ${
              statusLabel === 'Available'
                ? 'bg-[#d6e2dc] text-[#22524b]'
                : statusLabel === 'Locked'
                ? 'bg-yellow-100 text-yellow-700'
                : statusLabel === 'Ineligible'
                ? 'bg-[#e5d7d1] text-[#752b20]'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {statusLabel}
          </span>
          {availability.reasons.length > 0 && (
            <span>({availability.reasons.join(', ')})</span>
          )}
        </div>
        {pointRequirement && (
          <div className="mt-2 text-xs text-red-600">{pointRequirement}</div>
        )}
        {prereqLabels.length > 0 && (
          <div className="mt-2 text-xs text-(--muted)">
            <div className="font-semibold">Requirements:</div>
            <ul className="list-disc list-inside">
              {prereqLabels.map((req, idx) => (
                <li
                  key={idx}
                  className={req.met ? 'text-[#22524b]' : 'text-[#752b20]'}
                >
                  {req.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isSelected ? (
          <Button variant="outline" onClick={onRemove}>
            Remove
          </Button>
        ) : availability.status === 'available' ? (
          <>
            <select
              className="border border-black/10 rounded-lg px-2 py-1 text-xs"
              value={defaultSpendType}
              onChange={(e) => onSpendTypeChange(e.target.value as SkillPointType)}
            >
              {spendOptions.map((opt) => (
                <option key={opt} value={opt} disabled={disableOption(opt)}>
                  {opt}
                </option>
              ))}
            </select>
            <Button
              onClick={onAdd}
              disabled={!availability.canAfford || !canUseSpendType}
            >
              Add
            </Button>
          </>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </div>
    </div>
  );
};
