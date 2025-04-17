import { useState } from 'react';
import AttributeRow from '../components/CharacterCreator/AttributeRow';
import { Attribute, AttributeState } from '../types/attributes';
import { BASELINE } from '../data/attributeData';

const initialAttributes: AttributeState = { ...BASELINE };
const TOTAL_STARTING_POINTS = 38; // TODO: move to static file

export const CharacterCreator = () => {
  const [attributes, setAttributes] =
    useState<AttributeState>(initialAttributes);
  const [pool, setPool] = useState<number>(TOTAL_STARTING_POINTS);

  const handleAttributeChange = (
    attr: Attribute,
    newValue: number,
    poolDelta: number
  ) => {
    setAttributes((prev) => ({ ...prev, [attr]: newValue }));
    setPool((prev) => prev + poolDelta);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Character Creator</h2>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Character Name</label>
        <input className="border rounded px-2 py-1 w-full" />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Player Name</label>
        <input className="border rounded px-2 py-1 w-full" />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Race</label>
        <select className="border rounded px-2 py-1 w-full">
          <option value="">Select Race</option>
          {/* Add real race options here */}
        </select>
        <p className="text-sm text-gray-600 mt-2">
          Race bonuses and traits will appear here.
        </p>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-2">Attributes</h3>
      <p className="mb-4 text-gray-700 font-medium">Points left: {pool}</p>

      <table className="w-full table-fixed border-separate border-spacing-y-1">
        <thead>
          <tr>
            <th style={{ textAlign: 'left', paddingBottom: '0.5rem' }}>
              Attribute
            </th>
            <th style={{ textAlign: 'center', paddingBottom: '0.5rem' }}>
              Value
            </th>
            <th style={{ textAlign: 'center', paddingBottom: '0.5rem' }}>
              Mod
            </th>
            <th style={{ textAlign: 'center', paddingBottom: '0.5rem' }}>
              Next Cost
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(attributes).map((attr) => (
            <AttributeRow
              key={attr}
              attr={attr as Attribute}
              value={attributes[attr as Attribute]}
              baseline={BASELINE[attr as Attribute]}
              pool={pool}
              onChange={handleAttributeChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CharacterCreator;
