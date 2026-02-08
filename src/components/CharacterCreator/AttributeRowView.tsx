import { Attribute } from '@/types/attributes';
import { getModifier } from '@/utils/modifier';
import {
  getAttributeEffectDescById,
  getAttributeNameById,
  getPointCostChange,
} from '@/utils/attributeUtils';
import { useLanguage } from '@/context/LanguageContext';
import { uiLabels } from '@/i18n/ui';
import { Button } from '../ui/Button';

interface AttributeRowProps {
  attr: Attribute;
  value: number;
  baseline: number;
  pool: number;
  onChange: (attr: Attribute, newValue: number, poolDelta: number) => void;
  isLevelUpMode: boolean;
  usedPoints: number;
  hasAbilityPointThisLevel: boolean;
  requiredValue?: number;
  showNextCost?: boolean;
  showDelta?: boolean;
}

export function AttributeRow({
  attr,
  value,
  baseline,
  pool,
  onChange,
  isLevelUpMode,
  usedPoints,
  hasAbilityPointThisLevel,
  requiredValue,
  showNextCost = true,
  showDelta = false,
}: AttributeRowProps) {
  const nextValue = value + 1;
  const prevValue = value - 1;
  const cost = getPointCostChange(value, nextValue, baseline);
  const refund = getPointCostChange(prevValue, value, baseline);
  const min = baseline - 4;
  const max = baseline + 8;
  const { language } = useLanguage();
  const ui = uiLabels[language];
  const attrEffectDesc = getAttributeEffectDescById(attr, language);

  const canIncrease = isLevelUpMode
    ? hasAbilityPointThisLevel && usedPoints < 1
    : cost <= pool && value < max;

  const canDecrease = isLevelUpMode
    ? hasAbilityPointThisLevel && value > baseline
    : value > min;

  const modifier = getModifier(value);
  const delta = value - baseline;
  const handleDecrease = () => {
    if (!canDecrease) return;
    onChange(attr, prevValue, refund);
  };
  const handleIncrease = () => {
    if (!canIncrease) return;
    onChange(attr, nextValue, isLevelUpMode ? 1 : -cost);
  };

  return (
    <tr className="align-middle">
      {/* Attribute */}
      <td
        title={attrEffectDesc}
        className="w-20 font-semibold capitalize text-sm text-gray-800"
      >
        {getAttributeNameById(attr, language)}
      </td>

      {/* Race Base */}
      <td className="w-20 text-center font-mono text-sm">{baseline}</td>

      {/* Controls */}
      <td className="px-4 text-center align-middle">
        <div className="flex items-center justify-center gap-2">
          {/* Decrease */}
          <Button
            variant="outline"
            className="w-8 h-8 px-0 py-0 bg-black/5 hover:bg-black/10 flex items-center justify-center disabled:opacity-60 disabled:text-(--muted)"
            onClick={handleDecrease}
            disabled={!canDecrease}
          >
            -
          </Button>

      {/* Value */}
      <div
        className={`w-7.5 h-8 flex items-center justify-center font-mono text-sm ${
          requiredValue !== undefined && value < requiredValue
            ? 'text-red-600'
            : ''
        }`}
      >
        {value}
      </div>

      {/* Increase */}
      <Button
        variant="outline"
        className="w-8 h-8 px-0 py-0 bg-black/5 hover:bg-black/10 flex items-center justify-center disabled:opacity-60 disabled:text-(--muted)"
        onClick={handleIncrease}
        disabled={!canIncrease}
      >
        +
      </Button>
    </div>
  </td>

      {showDelta && (
        <td
          className={`w-20 text-center font-mono text-sm ${
            delta > 0 ? 'text-[#22524b] font-semibold' : 'text-(--muted)'
          }`}
        >
          {delta > 0 ? `+${delta}` : '—'}
        </td>
      )}

      {/* Modifier */}
      <td
        title={attrEffectDesc}
        className={`w-20 text-center font-mono text-sm rounded ${
          modifier > 0
            ? 'bg-[#d6e2dc] text-[#22524b]'
            : modifier < 0
              ? 'bg-[#ead2cc] text-[#8a1e0e]'
              : ''
        }`}
      >
        {modifier > 0 ? `+${modifier}` : modifier}
      </td>

      {/* Next Point Cost */}
      {showNextCost && (
        <td className="w-24 font-mono text-center pl-4 text-sm">
          {cost} {cost > 1 ? ui.pts : ui.pt}
        </td>
      )}
    </tr>
  );
}
