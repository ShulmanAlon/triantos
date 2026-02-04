import React from 'react';
import { Attribute } from '@/types/attributes';
import { getModifier } from '@/utils/modifier';
import { XP_TABLE } from '@/config/progression';
import { ClassId } from '@/types/gameClass';
import { getClassNameById } from '@/utils/classUtils';
import { RaceId } from '@/types/race';
import { getRaceNameById } from '@/utils/raceUtils';
import { useLanguage } from '@/context/LanguageContext';
import { uiLabels } from '@/i18n/ui';
import { getAttributeNameById } from '@/utils/attributeUtils';
import { ATTRIBUTE_ORDER } from '@/config/constants';
import { DerivedStats } from '@/types/characters';

interface CharacterSheetProps {
  characterName: string;
  playerName: string;
  selectedClassId: ClassId | undefined;
  selectedRaceId: RaceId | undefined;
  level: number;
  attributes: Record<Attribute, number>;
  derived: DerivedStats | null;
  skills?: {
    name: string;
    tier: number;
    source?: string;
    totalDescription?: string;
    skillDescription?: string;
  }[];
}

export const CharacterSheetView: React.FC<CharacterSheetProps> = ({
  characterName,
  playerName,
  selectedClassId = undefined,
  selectedRaceId = undefined,
  level,
  attributes,
  derived,
  skills = [],
}) => {
  const { language } = useLanguage();
  const ui = uiLabels[language];
  if (!derived) return null;
  return (
    <div className="mt-6 p-4 border rounded bg-gray-50 w-fit">
      <h2 className="text-2xl font-bold mb-4">{ui.characterSheet}</h2>
      <h2 className="text-xl font-bold mb-1">{characterName}</h2>
      <p className="text-sm text-gray-600 mb-4">
        {ui.player}: {playerName}
      </p>
      <p>
        {ui.class}:{' '}
        {selectedClassId
          ? getClassNameById(selectedClassId, language)
          : 'Select Class'}
      </p>
      <p>
        {ui.race}:{' '}
        {selectedRaceId
          ? getRaceNameById(selectedRaceId, language)
          : 'Select Race'}
      </p>
      <p>
        {ui.level}: {level}
      </p>
      <p>
        {ui.xpNeeded} {level + 1}: {XP_TABLE[level]}
      </p>

      <div className="mt-4 border rounded p-3 bg-white/70 shadow-sm">
        <h3 className="font-semibold mb-2">{ui.attributes}</h3>
        <table className="text-sm">
          <thead>
            <tr>
              <th className="text-left px-1"></th>
              <th className="text-left px-1">{ui.value}</th>
              <th className="text-left px-1">{ui.modifier}</th>
            </tr>
          </thead>
          <tbody>
            {ATTRIBUTE_ORDER.map((attr) => {
              const attrValue = attributes[attr];
              const modifier = getModifier(attrValue);
              return (
                <tr key={attr}>
                  <td className="pr-4 font-medium">
                    {getAttributeNameById(attr, language)}
                  </td>
                  <td className="pr-4 text-center">{attrValue}</td>
                  <td className="text-gray-500 text-center w-10">
                    {modifier > 0 ? `+${modifier}` : modifier}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">{ui.stats}</h3>
        <p>
          {ui.hp}: {derived.hp}
        </p>
        <p>
          {ui.baseAttackBonus}: {derived.baseAttackBonus ?? '—'}
        </p>

        {derived.spellSlots && (
          <div className="mt-4">
            <h4 className="font-semibold mb-1">{ui.spellSlots}</h4>
            <ul className="ml-4 list-disc text-sm text-gray-700">
              {Object.entries(derived.spellSlots).map(([level, slots]) => (
                <li key={level}>
                  {ui.levelSpell} {level}: {slots}{' '}
                  {slots !== 1 ? ui.spells : ui.spell}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {skills.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">{ui.skills}</h3>
          <div className="mt-2 space-y-2">
            {skills.map((skill, index) => (
              <details
                key={`${skill.name}-${skill.tier}-${index}`}
                className="rounded border border-gray-200 bg-white/70 px-3 py-2 text-sm text-gray-700"
              >
                <summary className="cursor-pointer font-medium">
                  {skill.name} — Tier {skill.tier}
                  {skill.totalDescription ? ` (${skill.totalDescription})` : ''}
                </summary>
                {skill.skillDescription && (
                  <div className="mt-2 text-xs text-gray-600 whitespace-pre-line">
                    {skill.skillDescription}
                  </div>
                )}
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
