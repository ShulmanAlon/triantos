import React from 'react';
import { getModifier } from '../../utils/modifier';

interface AttributeRowProps {
  attr: string;
  value: number;
  baseline: number;
  pointsLeft: number;
  onChange: (attr: string, delta: number) => void;
}

const getPointCostChange = (
  current: number,
  next: number,
  baseline: number
): number => {
  if (next <= baseline) return 0;
  return next - baseline;
};

const AttributeRow: React.FC<AttributeRowProps> = ({
  attr,
  value,
  baseline,
  pointsLeft,
  onChange,
}) => {
  const modifier = getModifier(value);
  const nextCost = getPointCostChange(value, value + 1, baseline);
  const canIncrease = pointsLeft >= nextCost;
  const canDecrease = value > 1;

  return (
    <div className="flex items-center gap-4 mb-2 flex-wrap sm:flex-nowrap">
      <div className="w-16 font-semibold">{attr}</div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(attr, -1)}
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={!canDecrease}
          title={!canDecrease ? 'Minimum value reached' : ''}
        >
          -
        </button>

        <span className="w-8 text-center">{value}</span>

        <button
          onClick={() => onChange(attr, 1)}
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={!canIncrease}
          title={
            !canIncrease
              ? `Requires ${nextCost} points, only ${pointsLeft} left`
              : ''
          }
        >
          +
        </button>
      </div>

      <div className="text-sm text-gray-600">Mod: {modifier}</div>

      <div className="flex items-center text-sm text-gray-600">
        <span className="ml-4">Next point cost: {nextCost} pts</span>
        <span
          className="ml-1 cursor-pointer"
          title="Points required to raise this attribute by 1"
        >
          ℹ️
        </span>
      </div>
    </div>
  );
};

export default AttributeRow;
