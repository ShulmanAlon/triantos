import React from 'react';

interface AttributeProps {
  attrName: string;
  value: number;
  modifier: string;
  cost: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const AttributeBlock: React.FC<AttributeProps> = ({
  attrName,
  value,
  modifier,
  cost,
  onIncrease,
  onDecrease,
}) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="w-16 font-semibold">{attrName}</div>

      <div className="flex items-center gap-2">
        <button onClick={onDecrease} className="px-2 py-1 bg-gray-200 rounded">
          -
        </button>
        <span className="w-8 text-center">{value}</span>
        <button onClick={onIncrease} className="px-2 py-1 bg-gray-200 rounded">
          +
        </button>
      </div>

      <div className="text-sm text-gray-600">Mod: {modifier}</div>

      <div className="flex items-center text-sm text-gray-600">
        <span className="ml-4">Next point cost: {cost} pts</span>
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

export const CharacterCreator: React.FC = () => {
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
          {/* Add more options */}
        </select>
        <p className="text-sm text-gray-600 mt-2">
          Greedy, cunning and power hungry, humans are the most influential and
          numerous race in The Exile even though they are the shortest lived.
          Very adaptable. Standing 1.5 up to 2.20 meters tall. Life expectancy
          ~80 years
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-2">Attributes</h3>
      <p className="mb-4">Points left: 38</p>

      {/* Example attribute rendering - you can loop this in real app */}
      <AttributeBlock
        attrName="STR"
        value={10}
        modifier={'+0'}
        cost={1}
        onIncrease={() => {}}
        onDecrease={() => {}}
      />
      <AttributeBlock
        attrName="DEX"
        value={10}
        modifier={'+0'}
        cost={1}
        onIncrease={() => {}}
        onDecrease={() => {}}
      />
      <AttributeBlock
        attrName="WIS"
        value={10}
        modifier={'+0'}
        cost={1}
        onIncrease={() => {}}
        onDecrease={() => {}}
      />
      <AttributeBlock
        attrName="INT"
        value={10}
        modifier={'+0'}
        cost={1}
        onIncrease={() => {}}
        onDecrease={() => {}}
      />
      <AttributeBlock
        attrName="CON"
        value={10}
        modifier={'+0'}
        cost={1}
        onIncrease={() => {}}
        onDecrease={() => {}}
      />
      <AttributeBlock
        attrName="CHA"
        value={10}
        modifier={'+0'}
        cost={1}
        onIncrease={() => {}}
        onDecrease={() => {}}
      />
    </div>
  );
};

export default CharacterCreator;
