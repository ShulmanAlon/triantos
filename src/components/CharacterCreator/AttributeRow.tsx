import { FC } from 'react';
import { Attribute } from '../../types/attributes';
import { getModifier } from '../../utils/modifier';
import { getPointCostChange } from '../../utils/attributeUtils';

interface AttributeRowProps {
  attr: Attribute;
  value: number;
  baseline: number;
  pool: number;
  onChange: (attr: Attribute, newValue: number, poolDelta: number) => void;
}

const AttributeRow: FC<AttributeRowProps> = ({
  attr,
  value,
  baseline,
  pool,
  onChange,
}) => {
  const min = baseline - 4;
  const max = baseline + 8;

  const nextValue = value + 1;
  const prevValue = value - 1;

  const cost = getPointCostChange(value, nextValue, baseline);
  const refund = getPointCostChange(prevValue, value, baseline);

  const canIncrease = value < max && pool >= cost;
  const canDecrease = value > min;

  const handleIncrease = () => {
    if (canIncrease) {
      onChange(attr, nextValue, -cost); // Use actual cost
      console.log(
        `Spending ${cost} points for increasing ${attr} from ${value} to ${nextValue}`
      );
    }
  };

  const handleDecrease = () => {
    if (canDecrease) {
      onChange(attr, prevValue, refund); // Use actual refund
      console.log(
        `Refunding ${refund} points for decreasing ${attr} from ${value} to ${prevValue}`
      );
    }
  };

  return (
    <div className="flex items-center gap-4 mb-3">
      <div className="w-20 font-semibold capitalize">{attr}</div>

      <div className="flex items-center gap-1">
        <button
          onClick={handleDecrease}
          disabled={!canDecrease}
          className="px-2 py-1 border rounded disabled:opacity-50"
          title={
            !canDecrease
              ? `Minimum (${min}) reached`
              : `Refunds ${refund} point${refund > 1 ? 's' : ''}`
          }
        >
          −
        </button>
        <span className="w-8 text-center">{value}</span>
        <button
          onClick={handleIncrease}
          disabled={!canIncrease}
          className="px-2 py-1 border rounded disabled:opacity-50"
          title={
            !canIncrease
              ? value >= max
                ? `Maximum (${max}) reached`
                : `Need ${cost} point${cost > 1 ? 's' : ''} to increase`
              : `Costs ${cost} point${cost > 1 ? 's' : ''}`
          }
        >
          +
        </button>
      </div>

      <div className="text-sm text-gray-600 ml-4">
        Mod: {getModifier(value)}
      </div>

      <div className="text-sm text-gray-500 ml-4">
        Next cost: {cost} pt{cost > 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default AttributeRow;
