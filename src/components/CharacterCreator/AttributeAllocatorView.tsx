import { ATTRIBUTE_ORDER } from '@/config/constants';
import { useLanguage } from '@/context/LanguageContext';
import { uiLabels } from '@/i18n/ui';
import { Attribute } from '@/types/attributes';
import { GameClass } from '@/types/gameClass';
import { AttributeRow } from './AttributeRowView';

interface AttributeAllocatorProps {
  attributes: Record<Attribute, number>;
  baseline: Record<Attribute, number>;
  pool: number;
  isLevelUpMode: boolean;
  usedPoints: number;
  hasAbilityPointThisLevel: boolean;
  showNextCost?: boolean;
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
  showNextCost = true,
  onChange,
  selectedClassData,
}) => {
  const { language } = useLanguage();
  const ui = uiLabels[language];
  return (
    <div className="mb-6 space-y-3">
      {/* Pool Tracker */}
      {!isLevelUpMode && (
        <div className="flex justify-end">
          <div className="text-sm text-gray-700">
            {ui.pointsRemaining}:{' '}
            <span className="ml-1 inline-flex items-center justify-center rounded-full bg-black/5 px-2 py-0.5 font-semibold">
              {pool}
            </span>
          </div>
        </div>
      )}

      {/* Attribute Table */}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-gray-600">
            <th className="text-left font-semibold pb-2 text-xs uppercase tracking-wide">
              {ui.attribute}
            </th>
            <th className="text-center font-semibold pb-2 text-xs uppercase tracking-wide">
              {ui.raceBase}
            </th>
            <th className="text-center font-semibold pb-2 text-xs uppercase tracking-wide">
              {ui.value}
            </th>
            <th className="text-center font-semibold pb-2 text-xs uppercase tracking-wide">
              {ui.modifier}
            </th>
            {showNextCost && (
              <th className="text-center font-semibold pb-2 text-xs uppercase tracking-wide">
                {ui.nextCost}
              </th>
            )}
            <th className="w-10">{/*Spacer for buttons column*/}</th>
          </tr>
        </thead>
        <tbody>
          {ATTRIBUTE_ORDER.map((attr) => (
            <AttributeRow
              key={attr}
              attr={attr}
              value={attributes[attr]}
              baseline={baseline[attr]}
              pool={pool}
              isLevelUpMode={isLevelUpMode}
              usedPoints={usedPoints}
              hasAbilityPointThisLevel={hasAbilityPointThisLevel}
              showNextCost={showNextCost}
              onChange={onChange}
              requiredValue={selectedClassData?.primaryAttributes?.[attr]}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
