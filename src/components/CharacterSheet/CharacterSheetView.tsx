import React from 'react';
import { Attribute } from '@/types/attributes';
import { getModifier } from '@/utils/modifier';
import { XP_TABLE } from '@/config/progression';
import { ClassId } from '@/types/gameClass';
import { getClassNameById } from '@/utils/classUtils';
import { getClassRestrictionsById } from '@/utils/classUtils';
import { RaceId } from '@/types/race';
import { getRaceNameById, getRaceRestrictionsById } from '@/utils/raceUtils';
import { useLanguage } from '@/context/LanguageContext';
import { uiLabels } from '@/i18n/ui';
import { getAttributeNameById } from '@/utils/attributeUtils';
import { ATTRIBUTE_ORDER } from '@/config/constants';
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder';
import { getCharacterBlurImage, getCharacterImage } from '@/utils/imageUtils';
import {
  DerivedStats,
  EquipmentLoadout,
  StatBlock,
  FinalCharacterStats,
} from '@/types/characters';
import { getLoadoutDisplayName } from '@/utils/domain/loadouts';
import {
  getSkillGroup,
  getSkillById,
  sortSkillsForDisplay,
  SkillSummary,
} from '@/utils/domain/skills';

type EquipmentSummary = {
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

interface CharacterSheetProps {
  characterName: string;
  playerName: string;
  imageUrl?: string | null;
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
  equipmentSummary?: EquipmentSummary;
  skills?: SkillSummary[];
}

const getStatValue = (block?: StatBlock<number>): number | null => {
  if (!block) return null;
  if (block.type === 'simple') return block.value;
  if (!block.entries || block.entries.length === 0) return null;
  const filtered = block.selectedLabels?.length
    ? block.entries.filter((entry) =>
        block.selectedLabels?.includes(entry.label),
      )
    : block.entries;
  return Math.max(...filtered.map((entry) => entry.total));
};

export const CharacterSheetView: React.FC<CharacterSheetProps> = ({
  characterName,
  playerName,
  imageUrl,
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
  const classRestrictions = getClassRestrictionsById(selectedClassId, language).filter(Boolean);
  const raceRestrictions = getRaceRestrictionsById(selectedRaceId, language).filter(Boolean);
  const [skillDetailsOpen, setSkillDetailsOpen] = React.useState({
    basic: false,
    actionable: false,
    passive: false,
  });
  if (!derived) return null;

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="section-rule">
      <h3 className="section-title">{title}</h3>
    </div>
  );

  return (
    <div className="mt-6 card p-5">
      <div className="flex flex-wrap items-start gap-4 mb-4">
        <div className="w-40 h-40 rounded-xl overflow-hidden border border-black/5">
          {imageUrl || selectedClassId ? (
            <ImageWithPlaceholder
              src={getCharacterImage(imageUrl ?? '', selectedClassId)}
              blurSrc={getCharacterBlurImage(selectedClassId)}
              alt={characterName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-(--muted)">
              —
            </div>
          )}
        </div>
        <div className="flex-1 min-w-60">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="chip">{ui.characterSheet}</p>
              <h2 className="text-2xl font-bold mt-2">{characterName}</h2>
              <p className="text-sm text-(--muted) mt-1">
                {ui.player}: {playerName}
              </p>
            </div>
            <div className="panel px-4 py-3 text-sm text-(--muted)">
              <div>
                {ui.level}: <span className="font-semibold">{level}</span>
              </div>
              <div>
                {ui.xpNeeded} {level + 1}:{' '}
                <span className="font-semibold">{XP_TABLE[level]}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-(--muted) mt-2">
            <span>
              {ui.class}:{' '}
              {selectedClassId
                ? getClassNameById(selectedClassId, language)
                : 'Select Class'}
            </span>
            <span>
              {ui.race}:{' '}
              {selectedRaceId
                ? getRaceNameById(selectedRaceId, language)
                : 'Select Race'}
            </span>
          </div>
          {classRestrictions.length > 0 && (
            <div className="text-xs text-(--muted) mt-1">
              <span className="font-semibold">
                {ui.class} {ui.restrictions}:
              </span>{' '}
              {classRestrictions.join(', ')}
            </div>
          )}
          {raceRestrictions.length > 0 && (
            <div className="text-xs text-(--muted) mt-1">
              <span className="font-semibold">
                {ui.race} {ui.restrictions}:
              </span>{' '}
              {raceRestrictions.join(', ')}
            </div>
          )}
        </div>
      </div>

      {finalStats && (
        <CombatSummary
          finalStats={finalStats}
          derived={derived}
          equipmentSummary={equipmentSummary}
        />
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-2 items-stretch">
        <div className="panel p-4">
          <SectionHeader title={ui.attributes} />
          <table className="text-base w-full">
            <thead>
              <tr>
                <th className="text-left px-2"></th>
                <th className="text-center px-2 w-20">{ui.value}</th>
                <th className="text-center px-2 w-20">{ui.modifier}</th>
              </tr>
            </thead>
            <tbody>
              {ATTRIBUTE_ORDER.map((attr) => {
                const attrValue = attributes[attr];
                const modifier = getModifier(attrValue);
                return (
                  <tr key={attr}>
                    <td className="pr-6 font-semibold text-(--ink)">
                      {getAttributeNameById(attr, language)}
                    </td>
                    <td className="px-2 text-center w-20 font-mono">
                      {attrValue}
                    </td>
                    <td className="text-(--muted) w-20 font-mono relative text-center">
                      <span className="absolute right-1/2 top-1/2 -translate-y-1/2 -translate-x-2 w-3 text-center">
                        {modifier === 0 ? ' ' : modifier > 0 ? '+' : '-'}
                      </span>
                      <span className="block w-full text-center tabular-nums">
                        {Math.abs(modifier)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <LoadoutList
          equipmentLoadouts={equipmentLoadouts}
          activeLoadoutId={activeLoadoutId}
          onLoadoutSelect={onLoadoutSelect}
          onLoadoutEdit={onLoadoutEdit}
        />
      </div>

      {derived.spellSlots && (
        <div className="mt-4 lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="panel p-4">
            <SectionHeader title={ui.spellSlots} />
            <ul className="ml-4 list-disc text-sm text-(--muted)">
              {Object.entries(derived.spellSlots).map(([level, slots]) => (
                <li key={level}>
                  {ui.levelSpell} {level}: {slots}{' '}
                  {slots !== 1 ? ui.spells : ui.spell}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div className="mt-4 space-y-6">
          <div className="flex items-center justify-between">
            <SectionHeader title={ui.skills} />
            <span className="text-xs text-(--muted)">
              {skills.length} total
            </span>
          </div>
          {(
            [
              { key: 'basic', title: 'Basic Skills' },
              { key: 'actionable', title: 'Actionable Skills' },
              { key: 'passive', title: 'Passive Skills' },
            ] as const
          ).map(({ key, title }) => {
            const groupedSkills = skills.filter((skill) => {
              const entity = getSkillById(skill.id);
              if (!entity) return false;
              return getSkillGroup(entity) === key;
            });
            if (groupedSkills.length === 0) return null;
            const isExpanded = skillDetailsOpen[key];

            const sortedEntities = sortSkillsForDisplay(
              groupedSkills
                .map((skill) => getSkillById(skill.id))
                .filter((skill): skill is NonNullable<typeof skill> => !!skill)
            );
            const sortedGroup = sortedEntities.map(
              (entity) => groupedSkills.find((s) => s.id === entity.id)!
            );

            return (
              <div key={key} className="panel p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="section-rule flex-1">
                    <h3 className="section-title">{title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSkillDetailsOpen((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                    className="text-[11px] font-semibold uppercase tracking-wide rounded-full border border-black/10 px-3 py-1 hover:bg-black/5"
                  >
                    {isExpanded ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
                <div className="mt-4 columns-1 sm:columns-2 gap-4">
                  {sortedGroup.map((skill, index) => (
                    <details
                      key={`${skill.name}-${skill.tier}-${index}`}
                      className="mb-2 break-inside-avoid rounded-xl border border-black/10 px-3 py-2 text-sm text-(--muted)"
                      open={isExpanded ? true : undefined}
                    >
                      <summary className="cursor-pointer font-medium">
                        {(() => {
                          const entity = getSkillById(skill.id);
                          const hasMultipleTiers =
                            entity && entity.tiers.length > 1;
                          const tierLabel = skill.tierName ?? 'Tier';
                          const isNumericTierName = /^Tier\s+\d+$/i.test(
                            tierLabel
                          );
                          const tierText = hasMultipleTiers
                            ? isNumericTierName
                              ? tierLabel
                              : `${tierLabel} (Tier ${skill.tier})`
                            : '';
                          const abilityLabel =
                            key === 'basic' && entity?.abilityModifier
                              ? `${entity.abilityModifier.toUpperCase()} Modifier`
                              : null;
                          return (
                            <>
                              {skill.name}
                              {abilityLabel && (
                                <span className="ml-2 text-[11px] font-semibold text-(--muted)">
                                  {abilityLabel}
                                </span>
                              )}
                              {tierText && (
                                <span className="text-(--muted)">
                                  {' '}
                                  — {tierText}
                                </span>
                              )}
                              {skill.totalDescription && (
                                <span>, {skill.totalDescription}</span>
                              )}
                            </>
                          );
                        })()}
                      </summary>
                      {skill.skillDescription && (
                        <div className="mt-2 text-xs text-(--muted) whitespace-pre-line">
                          {skill.skillDescription}
                        </div>
                      )}
                    </details>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

function CombatSummary({
  finalStats,
  derived,
  equipmentSummary,
}: {
  finalStats: FinalCharacterStats['final'];
  derived: DerivedStats;
  equipmentSummary?: EquipmentSummary;
}) {
  const [showDetails, setShowDetails] = React.useState(true);
  return (
    <div className="mt-4 panel p-4">
      <div className="flex items-center justify-between mb-2 gap-3">
        <div className="section-rule flex-1">
          <h3 className="section-title">Combat Summary</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowDetails((prev) => !prev)}
          className="text-[11px] font-semibold uppercase tracking-wide rounded-full border border-black/10 px-3 py-1 hover:bg-black/5"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      <div className="rounded-xl p-3 border border-black/5 mb-3">
        <div className="text-xs font-semibold text-(--ink)">Attacks / Round</div>
        <div className="text-[22px] font-bold">{derived.attacksPerRound}</div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div className="rounded-xl p-3 border border-black/5">
          <div className="text-xs font-semibold text-(--ink)">HP</div>
          <div className="text-[22px] font-bold">
            {getStatValue(finalStats.hpBreakdown) ?? derived.hp}
          </div>
          <StatBreakdown
            block={finalStats.hpBreakdown}
            showDetails={showDetails}
          />
        </div>
        <div className="rounded-xl p-3 border border-black/5">
          <div className="text-xs font-semibold text-(--ink)">Temp HP</div>
          <div className="text-[22px] font-bold">
            {getStatValue(finalStats.hpTemp) ?? 0}
          </div>
          <StatBreakdown block={finalStats.hpTemp} showDetails={showDetails} />
        </div>
        <div className="rounded-xl p-3 border border-black/5">
          <div className="text-xs font-semibold text-(--ink)">AC</div>
          <div className="text-[22px] font-bold">
            {getStatValue(finalStats.ac) ?? '—'}
          </div>
          <StatBreakdown block={finalStats.ac} showDetails={showDetails} />
        </div>
        {equipmentSummary?.showMeleeSummary && (
          <div className="rounded-xl p-3 border border-black/5">
            <div className="text-xs font-semibold text-(--ink)">
              Melee Attack
            </div>
            <div className="text-[22px] font-bold">
              {getStatValue(finalStats.meleeAttack) ?? derived.baseAttackBonus}
            </div>
            <StatBreakdown
              block={finalStats.meleeAttack}
              showDetails={showDetails}
            />
          </div>
        )}
        {equipmentSummary?.showMeleeSummary && (
          <div className="rounded-xl p-3 border border-black/5">
            <div className="text-xs font-semibold text-(--ink)">
              Melee Damage
            </div>
            <div className="text-base font-semibold">
              {equipmentSummary.meleeDamageSummary ?? '—'}
            </div>
            {equipmentSummary.meleeDamageParts &&
              equipmentSummary.meleeDamageParts.length > 0 && (
                <SummaryDetails showDetails={showDetails}>
                  <div className="rounded-lg p-2 space-y-1">
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
                </SummaryDetails>
              )}
          </div>
        )}
        {equipmentSummary?.showRangedSummary && (
          <div className="rounded-xl p-3 border border-black/5">
            <div className="text-xs font-semibold text-(--ink)">
              Ranged Attack
            </div>
            <div className="text-[22px] font-bold">
              {getStatValue(finalStats.rangedAttack) ?? derived.baseAttackBonus}
            </div>
            <StatBreakdown
              block={finalStats.rangedAttack}
              showDetails={showDetails}
            />
          </div>
        )}
        {equipmentSummary?.showRangedSummary && (
          <div className="rounded-xl p-3 border border-black/5">
            <div className="text-xs font-semibold text-(--ink)">
              Ranged Damage
            </div>
            <div className="text-base font-semibold">
              {equipmentSummary.rangedDamageSummary ?? '—'}
            </div>
            {equipmentSummary.rangedDamageParts &&
              equipmentSummary.rangedDamageParts.length > 0 && (
                <SummaryDetails showDetails={showDetails}>
                  <div className="rounded-lg p-2 space-y-1">
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
                </SummaryDetails>
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
    <div className="panel p-4 h-full">
      <div className="section-rule">
        <h3 className="section-title">Equipment Loadouts</h3>
      </div>
      <ul className="text-sm text-(--muted) space-y-2">
        {(equipmentLoadouts.length > 0
          ? equipmentLoadouts
          : [
              { id: 'loadout-1', name: 'Loadout 1', items: {} },
              { id: 'loadout-2', name: 'Loadout 2', items: {} },
              { id: 'loadout-3', name: 'Loadout 3', items: {} },
              { id: 'loadout-4', name: 'Loadout 4', items: {} },
            ]
        ).map((loadout) => (
          <li
            key={loadout.id}
            className="flex items-center justify-between gap-2 py-1"
          >
            <div className="flex items-center gap-2">
              <div
                className={
                  loadout.id === activeLoadoutId
                    ? 'font-semibold text-(--ink)'
                    : 'text-(--muted)'
                }
              >
                {getLoadoutDisplayName(loadout)}
              </div>
            </div>
            <div className="flex gap-2">
              {loadout.id === activeLoadoutId && (
                <span className="text-[10px] font-semibold uppercase tracking-wide text-(--ink) bg-black/5 rounded-full px-2 py-1">
                  Selected
                </span>
              )}
              {loadout.id !== activeLoadoutId && (
                <button
                  type="button"
                  onClick={() => onLoadoutSelect?.(loadout.id)}
                  className="text-xs font-semibold text-(--ink) hover:underline"
                >
                  Select
                </button>
              )}
              <button
                type="button"
                onClick={() => onLoadoutEdit?.(loadout.id)}
                className="text-xs font-semibold text-(--ink) hover:underline"
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

function SummaryDetails({
  showDetails,
  children,
}: {
  showDetails: boolean;
  children: React.ReactNode;
}) {
  if (!showDetails) return null;
  return (
    <div className="mt-1 text-xs text-(--muted)">
      <div className="mt-1 border-t border-black/5" />
      <div className="pt-1 space-y-2">{children}</div>
    </div>
  );
}

function StatBreakdown({
  block,
  showDetails,
}: {
  block?: StatBlock<number>;
  showDetails: boolean;
}) {
  if (!block || block.type !== 'breakdown') return null;
  return (
    <SummaryDetails showDetails={showDetails}>
      {block.entries.map((entry) => (
        <div key={entry.label} className="rounded-lg p-2">
          <div className="space-y-1">
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
    </SummaryDetails>
  );
}
