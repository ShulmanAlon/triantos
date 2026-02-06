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
    <div className="flex items-start justify-between gap-4 border rounded-xl p-3 bg-white/80">
      <div>
        <div className="font-medium text-gray-800">Tier {tier.tier}</div>
        {(tier.deltaDescription ?? tier.description) && (
          <div className="text-xs text-gray-600">
            {tier.deltaDescription ?? tier.description}
          </div>
        )}
        <div className="text-xs text-gray-500 mt-1">
          {statusLabel}
          {availability.reasons.length > 0
            ? ` (${availability.reasons.join(', ')})`
            : ''}
        </div>
        {pointRequirement && (
          <div className="mt-2 text-xs text-red-600">{pointRequirement}</div>
        )}
        {availability.status === 'locked' && prereqLabels.length > 0 && (
          <div className="mt-2 text-xs text-gray-600">
            <div className="font-semibold">Requirements:</div>
            <ul className="list-disc list-inside">
              {prereqLabels.map((req, idx) => (
                <li
                  key={idx}
                  className={req.met ? 'text-green-600' : 'text-red-600'}
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
              className="border border-gray-300 rounded-md px-2 py-1 text-xs"
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
