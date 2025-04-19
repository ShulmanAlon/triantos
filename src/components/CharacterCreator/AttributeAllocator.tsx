import { Attribute } from '../../types/attributes';
import { GameClass } from '../../types/gameClass';
import { AttributeRow } from './AttributeRow';

interface AttributeAllocatorProps {
  attributes: Record<Attribute, number>;
  baseline: Record<Attribute, number>;
  pool: number;
  isLevelUpMode: boolean;
  usedPoints: number;
  hasAbilityPointThisLevel: boolean;
  onChange: (attr: Attribute, newValue: number, cost: number) => void;
  selectedClassData?: GameClass | undefined;
}

export const AttributeAllocator: React.FC<AttributeAllocatorProps> = ({
  attributes,
  baseline,
  pool,
  isLevelUpMode,
  usedPoints,
  hasAbilityPointThisLevel,
  onChange,
  selectedClassData,
}) => {
  return (
    <div className="mb-6 space-y-3">
      {/* Title */}
      <h3 className="text-base font-semibold text-gray-800">Attributes</h3>

      {/* Pool Tracker */}
      {!isLevelUpMode && (
        <p className="text-sm text-right text-gray-700">
          Points remaining: <strong>{pool}</strong>
        </p>
      )}

      {/* Attribute Table */}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-gray-600">
            <th className="text-left font-semibold pb-1">Attribute</th>
            <th className="text-center font-semibold pb-1">Race Base</th>
            <th className="text-center font-semibold pb-1">Value</th>
            <th className="text-center font-semibold pb-1">Modifier</th>
            <th className="text-center font-semibold pb-1">Next Point Cost</th>
            <th className="w-10" /> {/* Spacer for buttons column */}
          </tr>
        </thead>
        <tbody>
          {Object.keys(attributes).map((attr) => (
            <AttributeRow
              key={attr}
              attr={attr as Attribute}
              value={attributes[attr as Attribute]}
              baseline={baseline[attr as Attribute]}
              pool={pool}
              isLevelUpMode={isLevelUpMode}
              usedPoints={usedPoints}
              hasAbilityPointThisLevel={hasAbilityPointThisLevel}
              onChange={onChange}
              requiredValue={
                selectedClassData?.primaryAttributes?.[attr as Attribute]
              }
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
