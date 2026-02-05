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
            className={
              'w-8 h-8 border rounded-lg border-gray-300 flex items-center justify-center'
            }
            onClick={() => canDecrease && onChange(attr, prevValue, refund)}
            disabled={!canDecrease}
          >
            -
          </Button>

          {/* Value */}
          <div
            className={`w-[30px] h-8 flex items-center justify-center font-mono text-sm ${
              requiredValue !== undefined && value < requiredValue
                ? 'text-red-600'
                : ''
            }`}
          >
            {value}
          </div>

          {/* Increase */}
          <Button
            className={
              'w-8 h-8 border rounded-lg border-gray-300 flex items-center justify-center'
            }
            onClick={() => {
              if (!canIncrease) return;
              onChange(attr, nextValue, isLevelUpMode ? 1 : -cost);
            }}
            disabled={!canIncrease}
          >
            +
          </Button>
        </div>
      </td>

      {/* Modifier */}
      <td
        title={attrEffectDesc}
        className={`w-20 text-center font-mono text-sm rounded ${
          modifier > 0
            ? 'bg-green-100 text-green-700'
            : modifier < 0
            ? 'bg-red-100 text-red-700'
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
