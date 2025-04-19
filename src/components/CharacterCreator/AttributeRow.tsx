import { Attribute } from '../../types/attributes';
import { getModifier } from '../../utils/modifier';
import { getPointCostChange } from '../../utils/attributeUtils';
import { ATTRIBUTE_EFFECTS } from '../../config/constants'; // or wherever you put it

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
}: AttributeRowProps) {
  const nextValue = value + 1;
  const prevValue = value - 1;
  const cost = getPointCostChange(value, nextValue, baseline);
  const refund = getPointCostChange(prevValue, value, baseline);
  const min = baseline - 4;
  const max = baseline + 8;

  // const canIncrease = value < max && pool >= cost;
  const canIncrease = isLevelUpMode
    ? hasAbilityPointThisLevel && usedPoints < 1
    : cost <= pool && value < max;

  const canDecrease = !isLevelUpMode && value > min;

  const modifier = getModifier(value);

  return (
    <tr className="align-middle">
      {/* Attribute */}
      <td
        title={ATTRIBUTE_EFFECTS[attr]}
        className="w-20 font-semibold capitalize text-sm text-gray-800"
      >
        {attr.toUpperCase()}
      </td>

      {/* Race Base */}
      <td className="w-20 text-center font-mono text-sm">{baseline}</td>

      {/* Controls */}
      <td className="px-4 text-center align-middle">
        <div className="flex items-center justify-center gap-2">
          {/* Decrease */}
          <button
            className={`w-8 h-8 text-m border border-gray-300 rounded flex items-center justify-center ${
              canDecrease ? '' : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={() => canDecrease && onChange(attr, prevValue, refund)}
            disabled={!canDecrease || isLevelUpMode}
          >
            -
          </button>

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
          <button
            onClick={() => {
              if (!canIncrease) return;
              onChange(attr, nextValue, isLevelUpMode ? 1 : -cost);
            }}
            disabled={!canIncrease}
            className={`w-8 h-8 text-lg border border-gray-300 rounded flex items-center justify-center ${
              canIncrease ? '' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            +
          </button>
        </div>
      </td>

      {/* Modifier */}
      <td
        title={ATTRIBUTE_EFFECTS[attr]}
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
      <td className="w-24 font-mono text-center pl-4 text-sm">
        {cost} pt{cost > 1 ? 's' : ''}
      </td>
    </tr>
  );
}
