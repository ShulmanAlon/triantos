import { Attribute } from '@/types/attributes';
import { GameClass } from '@/types/gameClass';
import { AttributeAllocator } from '@/components/CharacterCreator/AttributeAllocatorView';

type AttributePointSectionProps = {
  hasAbilityPoint: boolean;
  hasUnspent: boolean;
  attributesReady: boolean;
  attributes: Record<Attribute, number>;
  baseline: Record<Attribute, number>;
  usedPoints: number;
  onChange: (attr: Attribute, newValue: number, poolDelta: number) => void;
  selectedClassData?: GameClass;
};

export const AttributePointSection = ({
  hasAbilityPoint,
  hasUnspent,
  attributesReady,
  attributes,
  baseline,
  usedPoints,
  onChange,
  selectedClassData,
}: AttributePointSectionProps) => {
  if (!hasAbilityPoint) {
    return (
      <div className="text-sm text-gray-600 mb-4 panel p-3">
        No attribute points available at this level.
      </div>
    );
  }

  return (
    <>
      <div className="text-sm text-gray-700 mb-2">
        Attribute point available.
      </div>
      {attributesReady ? (
        <AttributeAllocator
          attributes={attributes}
          baseline={baseline}
          pool={0}
          isLevelUpMode={true}
          usedPoints={usedPoints}
          hasAbilityPointThisLevel={hasAbilityPoint}
          showNextCost={false}
          onChange={onChange}
          selectedClassData={selectedClassData}
        />
      ) : (
        <div className="text-sm text-gray-600">Loading attributes…</div>
      )}
      {hasUnspent && (
        <div className="mt-2 text-xs text-red-600">
          You must spend the available attribute point to level up.
        </div>
      )}
    </>
  );
};
