import React, { useState } from 'react';
import AttributeRow from '../components/CharacterCreator/AttributeRow';

interface AttributeState {
  [key: string]: number;
}

const BASELINE: AttributeState = {
  STR: 10,
  DEX: 10,
  WIS: 10,
  INT: 10,
  CON: 10,
  CHA: 10,
};

const getPointCostChange = (
  current: number,
  next: number,
  baseline: number
): number => {
  if (next <= baseline) return 0;
  return next - baseline;
};

export const CharacterCreator: React.FC = () => {
  const [attributes, setAttributes] = useState<AttributeState>({ ...BASELINE });
  const [pointsLeft, setPointsLeft] = useState(38);

  const handleChange = (attr: string, delta: number) => {
    const current = attributes[attr];
    const next = current + delta;
    const costChange =
      getPointCostChange(current, next, BASELINE[attr]) -
      getPointCostChange(current, current, BASELINE[attr]);

    if (next < 1 || pointsLeft - costChange < 0) return;

    setAttributes((prev) => ({ ...prev, [attr]: next }));
    setPointsLeft((prev) => prev - costChange);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Character Creator</h2>

      <div className="mb-4">
        <label className="font-medium mr-2">Character Name</label>
        <input type="text" className="border rounded px-2 py-1" />
      </div>

      <div className="mb-4">
        <label className="font-medium mr-2">Player Name</label>
        <input type="text" className="border rounded px-2 py-1" />
      </div>

      <div className="mb-6">
        <label className="font-medium mr-2">Race</label>
        <select className="border rounded px-2 py-1">
          <option>Human</option>
        </select>
        <p className="text-sm text-gray-600 mt-2">
          Greedy, cunning and power hungry, humans are the most influential and
          numerous race in The Exile even though they are the shortest lived.
          Very adaptable. Standing 1.5 up to 2.20 meters tall. Life expectancy
          ~80 years
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-2">Attributes</h3>
      <p className="mb-4">Points left: {pointsLeft}</p>

      {Object.keys(attributes).map((attr) => (
        <AttributeRow
          key={attr}
          attr={attr}
          value={attributes[attr]}
          baseline={BASELINE[attr]}
          pointsLeft={pointsLeft}
          onChange={handleChange}
        />
      ))}
    </div>
  );
};

export default CharacterCreator;
