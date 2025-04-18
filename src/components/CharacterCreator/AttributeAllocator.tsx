import { Attribute } from '../../types/attributes';
import { AttributeRow } from './AttributeRow';

interface AttributeAllocatorProps {
  attributes: Record<Attribute, number>;
  baseline: Record<Attribute, number>;
  pool: number;
  isLevelUpMode: boolean;
  usedPoints: number;
  hasAbilityPointThisLevel: boolean;
  onChange: (attr: Attribute, newValue: number, cost: number) => void;
}

export const AttributeAllocator: React.FC<AttributeAllocatorProps> = ({
  attributes,
  baseline,
  pool,
  isLevelUpMode,
  usedPoints,
  hasAbilityPointThisLevel,
  onChange,
}) => {
  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2">Attributes</h3>
      {!isLevelUpMode && (
        <p className="mt-2 text-sm text-right">
          Points remaining: <strong>{pool}</strong>
        </p>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">Attribute</th>
            <th className="text-center">Race Base</th>
            <th className="text-center">Value</th>
            <th className="text-center">Modifier</th>
            <th className="text-center">Next Point Cost</th>
            <th />
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
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
