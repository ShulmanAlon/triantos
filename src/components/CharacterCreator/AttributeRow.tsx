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
  const nextValue = value + 1;
  const prevValue = value - 1;

  const min = baseline - 4;
  const max = baseline + 8;

  const cost = getPointCostChange(value, nextValue, baseline);
  const refund = getPointCostChange(prevValue, value, baseline);

  const canIncrease = value < max && pool >= cost;
  const canDecrease = value > min;

  const handleIncrease = () => {
    if (canIncrease) {
      onChange(attr, nextValue, -cost);
    }
  };

  const handleDecrease = () => {
    if (canDecrease) {
      onChange(attr, prevValue, refund);
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
          title={canDecrease ? 'Remove point' : 'Cannot go below baseline'}
        >
          −
        </button>
        <span className="w-8 text-center">{value}</span>
        <button
          onClick={handleIncrease}
          disabled={!canIncrease}
          className="px-2 py-1 border rounded disabled:opacity-50"
          title={
            canIncrease
              ? `Costs ${cost} point${cost > 1 ? 's' : ''}`
              : `Need ${cost} point${cost > 1 ? 's' : ''} to increase`
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
