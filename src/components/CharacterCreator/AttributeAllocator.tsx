import React, { useState } from 'react';
import { getPointCostChange } from '../../utils/attributeCost';
import { getModifier } from '../../utils/modifier';

const ATTRIBUTES = ['STR', 'DEX', 'WIS', 'INT', 'CON', 'CHA'] as const;
type Attribute = (typeof ATTRIBUTES)[number];

interface Props {
  baseline: Record<Attribute, number>;
  poolSize?: number;
}

export const AttributeAllocator: React.FC<Props> = ({
  baseline,
  poolSize = 38,
}) => {
  const initial = ATTRIBUTES.reduce((acc, attr) => {
    acc[attr] = baseline[attr];
    return acc;
  }, {} as Record<Attribute, number>);

  const [values, setValues] = useState<Record<Attribute, number>>(initial);

  const getTotalPointsUsed = () => {
    return ATTRIBUTES.reduce((sum, attr) => {
      const cost = getPointCostChange(
        baseline[attr],
        values[attr],
        baseline[attr]
      );
      return cost !== null ? sum + cost : sum;
    }, 0);
  };

  const remainingPoints = poolSize - getTotalPointsUsed();

  const increase = (attr: Attribute) => {
    const current = values[attr];
    const next = current + 1;
    const cost = getPointCostChange(current, next, baseline[attr]);
    if (cost !== null && cost <= remainingPoints) {
      setValues({ ...values, [attr]: next });
    }
  };

  const decrease = (attr: Attribute) => {
    const current = values[attr];
    const prev = current - 1;
    const refund = getPointCostChange(current, prev, baseline[attr]);
    if (refund !== null) {
      setValues({ ...values, [attr]: prev });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Attributes</h2>
        <p className="text-sm text-gray-600">
          Points left:{' '}
          <span
            className={
              remainingPoints < 0 ? 'text-red-600 font-bold' : 'font-semibold'
            }
          >
            {remainingPoints}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ATTRIBUTES.map((attr) => {
          const base = baseline[attr];
          const current = values[attr];
          const modifier = getModifier(current);
          const nextCost = getPointCostChange(current, current + 1, base);

          return (
            <div
              key={attr}
              className="border rounded-lg p-4 shadow-sm space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg w-12">{attr}</span>

                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded font-bold w-8"
                    onClick={() => decrease(attr)}
                  >
                    –
                  </button>
                  <span className="font-mono text-lg w-6 text-center">
                    {current}
                  </span>
                  <button
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded font-bold w-8"
                    onClick={() => increase(attr)}
                  >
                    +
                  </button>
                </div>

                <div className="text-sm text-gray-600 font-mono w-20 text-right">
                  Mod:{' '}
                  <span className="text-gray-800">
                    {modifier >= 0 ? `+${modifier}` : modifier}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Next point cost:{' '}
                <span
                  title="This is how many points you'll need to raise this attribute by 1"
                  className={
                    nextCost !== null && nextCost > remainingPoints
                      ? 'text-red-500 font-semibold'
                      : ''
                  }
                >
                  {nextCost !== null ? `${nextCost} pts` : 'Max reached'}
                </span>{' '}
                <span title="This is how many points you'll need to raise this attribute by 1">
                  ℹ️
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
