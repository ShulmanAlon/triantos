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
import {
  DerivedStats,
  EquipmentLoadout,
  StatBlock,
  FinalCharacterStats,
} from '@/types/characters';
import { getLoadoutDisplayName } from '@/utils/domain/loadouts';

interface CharacterSheetProps {
  characterName: string;
  playerName: string;
  selectedClassId: ClassId | undefined;
  selectedRaceId: RaceId | undefined;
  level: number;
  attributes: Record<Attribute, number>;
  derived: DerivedStats | null;
  equipmentLoadouts?: EquipmentLoadout[];
  activeLoadoutId?: string;
  onLoadoutSelect?: (loadoutId: string) => void;
  onLoadoutEdit?: (loadoutId: string) => void;
  finalStats?: FinalCharacterStats['final'];
  equipmentSummary?: {
    armorTypeLabel?: string;
    rangedTypeLabel?: string;
    meleeTypeLabel?: string;
    showRangedSummary?: boolean;
    showMeleeSummary?: boolean;
    rangedDamageSummary?: string;
    rangedDamageParts?: { label: string; value: string }[];
    meleeDamageSummary?: string;
    meleeDamageParts?: { label: string; value: string }[];
  };
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
  equipmentLoadouts = [],
  activeLoadoutId,
  onLoadoutSelect,
  onLoadoutEdit,
  finalStats,
  equipmentSummary,
  skills = [],
}) => {
  const { language } = useLanguage();
  const ui = uiLabels[language];
  if (!derived) return null;
  const getStatValue = (block?: StatBlock<number>): number | null => {
    if (!block) return null;
    if (block.type === 'simple') return block.value;
    if (!block.entries || block.entries.length === 0) return null;
    const filtered = block.selectedLabels?.length
      ? block.entries.filter((entry) =>
          block.selectedLabels?.includes(entry.label)
        )
      : block.entries;
    return Math.max(...filtered.map((entry) => entry.total));
  };

  const renderBreakdown = (block?: StatBlock<number>) => {
    if (!block || block.type !== 'breakdown') return null;
    return (
      <details className="mt-2 text-xs text-[var(--muted)]">
        <summary className="cursor-pointer">Details</summary>
        <div className="mt-2 space-y-2">
          {block.entries.map((entry) => (
            <div key={entry.label} className="rounded-lg bg-white/70 p-2">
              <div className="text-[var(--ink)] font-semibold">
                {entry.label}: {entry.total}
              </div>
              <div className="mt-1 space-y-1">
                {entry.components.map((component) => (
                  <div
                    key={`${entry.label}-${component.source}`}
                    className="flex items-center justify-between"
                  >
                    <span>{component.source}</span>
                    <span>
                      {component.source === 'Base'
                        ? component.value
                        : component.value >= 0
                        ? `+${component.value}`
                        : component.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </details>
    );
  };

  return (
    <div className="mt-6 card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <p className="chip">{ui.characterSheet}</p>
          <h2 className="text-2xl font-bold mt-2">{characterName}</h2>
          <p className="text-sm text-[var(--muted)]">
            {ui.player}: {playerName}
          </p>
        </div>
        <div className="panel px-4 py-3 text-sm text-[var(--muted)]">
          <div>
            {ui.level}: <span className="font-semibold">{level}</span>
          </div>
          <div>
            {ui.xpNeeded} {level + 1}:{' '}
            <span className="font-semibold">{XP_TABLE[level]}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-[var(--muted)]">
        {ui.class}:{' '}
        {selectedClassId
          ? getClassNameById(selectedClassId, language)
          : 'Select Class'}
      </p>
      <p className="text-sm text-[var(--muted)]">
        {ui.race}:{' '}
        {selectedRaceId
          ? getRaceNameById(selectedRaceId, language)
          : 'Select Race'}
      </p>

      {finalStats && (
        <CombatSummary
          finalStats={finalStats}
          derived={derived}
          equipmentSummary={equipmentSummary}
          getStatValue={getStatValue}
          renderBreakdown={renderBreakdown}
        />
      )}

      <div className="mt-4 panel p-4">
        <h3 className="section-title mb-2">{ui.attributes}</h3>
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
                  <td className="pr-4 font-medium text-[var(--ink)]">
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

      {derived.spellSlots && (
        <div className="mt-4 panel p-4">
          <h3 className="section-title mb-2">{ui.spellSlots}</h3>
          <ul className="ml-4 list-disc text-sm text-[var(--muted)]">
            {Object.entries(derived.spellSlots).map(([level, slots]) => (
              <li key={level}>
                {ui.levelSpell} {level}: {slots}{' '}
                {slots !== 1 ? ui.spells : ui.spell}
              </li>
            ))}
          </ul>
        </div>
      )}

      <LoadoutList
        equipmentLoadouts={equipmentLoadouts}
        activeLoadoutId={activeLoadoutId}
        onLoadoutSelect={onLoadoutSelect}
        onLoadoutEdit={onLoadoutEdit}
      />

      {skills.length > 0 && (
        <div className="mt-4">
          <h3 className="section-title">{ui.skills}</h3>
          <div className="mt-2 space-y-2">
            {skills.map((skill, index) => (
              <details
                key={`${skill.name}-${skill.tier}-${index}`}
                className="rounded-xl border border-black/5 bg-white/80 px-3 py-2 text-sm text-[var(--muted)]"
              >
                <summary className="cursor-pointer font-medium">
                  {skill.name} — Tier {skill.tier}
                  {skill.totalDescription ? ` (${skill.totalDescription})` : ''}
                </summary>
                {skill.skillDescription && (
                  <div className="mt-2 text-xs text-[var(--muted)] whitespace-pre-line">
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

function CombatSummary({
  finalStats,
  derived,
  equipmentSummary,
  getStatValue,
  renderBreakdown,
}: {
  finalStats: FinalCharacterStats['final'];
  derived: DerivedStats;
  equipmentSummary?: {
    armorTypeLabel?: string;
    rangedTypeLabel?: string;
    meleeTypeLabel?: string;
    showRangedSummary?: boolean;
    showMeleeSummary?: boolean;
    rangedDamageSummary?: string;
    rangedDamageParts?: { label: string; value: string }[];
    meleeDamageSummary?: string;
    meleeDamageParts?: { label: string; value: string }[];
  };
  getStatValue: (block?: StatBlock<number>) => number | null;
  renderBreakdown: (block?: StatBlock<number>) => React.ReactNode;
}) {
  return (
    <div className="mt-4 panel p-4">
      <h3 className="section-title mb-3">Combat Summary</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white/80 p-3 border border-black/5">
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
            HP
          </div>
          <div className="text-2xl font-bold">
            {getStatValue(finalStats.hpBreakdown) ?? derived.hp}
          </div>
          {renderBreakdown(finalStats.hpBreakdown)}
        </div>
        <div className="rounded-xl bg-white/80 p-3 border border-black/5">
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Temp HP
          </div>
          <div className="text-2xl font-bold">
            {getStatValue(finalStats.hpTemp) ?? 0}
          </div>
          {renderBreakdown(finalStats.hpTemp)}
        </div>
        <div className="rounded-xl bg-white/80 p-3 border border-black/5">
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
            AC
          </div>
          <div className="text-2xl font-bold">
            {getStatValue(finalStats.ac) ?? '—'}
          </div>
          {equipmentSummary?.armorTypeLabel && (
            <div className="text-xs text-[var(--muted)]">
              {equipmentSummary.armorTypeLabel}
            </div>
          )}
          {renderBreakdown(finalStats.ac)}
        </div>
        {equipmentSummary?.showMeleeSummary && (
          <div className="rounded-xl bg-white/80 p-3 border border-black/5">
            <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
              Melee Attack
            </div>
            <div className="text-2xl font-bold">
              {getStatValue(finalStats.meleeAttack) ?? derived.baseAttackBonus}
            </div>
            {equipmentSummary?.meleeTypeLabel && (
              <div className="text-xs text-[var(--muted)]">
                {equipmentSummary.meleeTypeLabel}
              </div>
            )}
            {renderBreakdown(finalStats.meleeAttack)}
          </div>
        )}
        {equipmentSummary?.showMeleeSummary && (
          <div className="rounded-xl bg-white/80 p-3 border border-black/5">
            <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
              Melee Damage
            </div>
            <div className="text-lg font-semibold">
              {equipmentSummary.meleeDamageSummary ?? '—'}
            </div>
            {equipmentSummary.meleeDamageParts &&
              equipmentSummary.meleeDamageParts.length > 0 && (
                <details className="mt-2 text-xs text-[var(--muted)]">
                  <summary className="cursor-pointer">Details</summary>
                  <div className="mt-2 space-y-1">
                    {equipmentSummary.meleeDamageParts.map((part, idx) => (
                      <div
                        key={`${part.label}-${idx}`}
                        className="flex items-center justify-between"
                      >
                        <span>{part.label}</span>
                        <span>{part.value}</span>
                      </div>
                    ))}
                  </div>
                </details>
              )}
          </div>
        )}
        {equipmentSummary?.showRangedSummary && (
          <div className="rounded-xl bg-white/80 p-3 border border-black/5">
            <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
              Ranged Attack
            </div>
            <div className="text-2xl font-bold">
              {getStatValue(finalStats.rangedAttack) ?? derived.baseAttackBonus}
            </div>
            {equipmentSummary?.rangedTypeLabel && (
              <div className="text-xs text-[var(--muted)]">
                {equipmentSummary.rangedTypeLabel}
              </div>
            )}
            {renderBreakdown(finalStats.rangedAttack)}
          </div>
        )}
        {equipmentSummary?.showRangedSummary && (
          <div className="rounded-xl bg-white/80 p-3 border border-black/5">
            <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
              Ranged Damage
            </div>
            <div className="text-lg font-semibold">
              {equipmentSummary.rangedDamageSummary ?? '—'}
            </div>
            {equipmentSummary.rangedDamageParts &&
              equipmentSummary.rangedDamageParts.length > 0 && (
                <details className="mt-2 text-xs text-[var(--muted)]">
                  <summary className="cursor-pointer">Details</summary>
                  <div className="mt-2 space-y-1">
                    {equipmentSummary.rangedDamageParts.map((part, idx) => (
                      <div
                        key={`${part.label}-${idx}`}
                        className="flex items-center justify-between"
                      >
                        <span>{part.label}</span>
                        <span>{part.value}</span>
                      </div>
                    ))}
                  </div>
                </details>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadoutList({
  equipmentLoadouts,
  activeLoadoutId,
  onLoadoutSelect,
  onLoadoutEdit,
}: {
  equipmentLoadouts: EquipmentLoadout[];
  activeLoadoutId?: string;
  onLoadoutSelect?: (loadoutId: string) => void;
  onLoadoutEdit?: (loadoutId: string) => void;
}) {
  return (
    <div className="mt-4 panel p-4">
      <h3 className="section-title mb-2">Equipment Loadouts</h3>
      <ul className="text-sm text-[var(--muted)] space-y-2">
        {(equipmentLoadouts.length > 0
          ? equipmentLoadouts
          : [
              { id: 'loadout-1', name: 'Loadout 1', items: {} },
              { id: 'loadout-2', name: 'Loadout 2', items: {} },
              { id: 'loadout-3', name: 'Loadout 3', items: {} },
              { id: 'loadout-4', name: 'Loadout 4', items: {} },
            ]
        ).map((loadout) => (
          <li key={loadout.id} className="flex items-center justify-between gap-2">
            <div>
              <div
                className={
                  loadout.id === activeLoadoutId
                    ? 'font-semibold text-[var(--ink)]'
                    : 'text-[var(--muted)]'
                }
              >
                {getLoadoutDisplayName(loadout)}
              </div>
              {loadout.id === activeLoadoutId && (
                <div className="text-xs text-[var(--muted)]">Active</div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onLoadoutSelect?.(loadout.id)}
                className="text-xs font-semibold rounded-lg border border-black/10 px-2 py-1 hover:bg-black/5"
              >
                {loadout.id === activeLoadoutId ? 'Selected' : 'Select'}
              </button>
              <button
                type="button"
                onClick={() => onLoadoutEdit?.(loadout.id)}
                className="text-xs font-semibold rounded-lg border border-black/10 px-2 py-1 hover:bg-black/5"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
