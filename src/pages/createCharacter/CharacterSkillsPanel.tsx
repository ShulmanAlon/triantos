import React from 'react';
import { SkillEntity, SkillId, SkillPointType } from '@/types/skills';
import { getSkillGroup, sortSkillsForDisplay } from '@/utils/domain/skills';
import { SkillSelectionEntry, SkillPointPool } from '@/types/characters';
import { SkillTierRow } from '@/pages/levelUp/SkillTierRow';

type SkillAvailability = {
  status: 'available' | 'locked' | 'ineligible' | 'acquired';
  reasons: string[];
  canAfford: boolean;
};

type CharacterSkillsPanelProps = {
  skills: SkillEntity[];
  skillRemaining: SkillPointPool;
  currentSelections: SkillSelectionEntry[];
  showAcquired: boolean;
  showLocked: boolean;
  showIneligible: boolean;
  getAvailability: (skill: SkillEntity, tier: number) => SkillAvailability;
  getPrereqLabels: (skill: SkillEntity, tier: number) => { label: string; met: boolean }[];
  getPointRequirement: (
    skill: SkillEntity,
    tier: number,
    availability: SkillAvailability
  ) => string | null;
  getSpendOptions: (skill: SkillEntity) => SkillPointType[];
  getDefaultSpendType: (tierKey: string, skill: SkillEntity) => SkillPointType;
  onSpendTypeChange: (tierKey: string, value: SkillPointType) => void;
  onAdd: (skillId: SkillId, tier: number, spendType: SkillPointType) => void;
  onRemove: (skillId: SkillId, tier: number) => void;
};

export const CharacterSkillsPanel = ({
  skills,
  skillRemaining,
  currentSelections,
  showAcquired,
  showLocked,
  showIneligible,
  getAvailability,
  getPrereqLabels,
  getPointRequirement,
  getSpendOptions,
  getDefaultSpendType,
  onSpendTypeChange,
  onAdd,
  onRemove,
}: CharacterSkillsPanelProps) => {
  // TODO: Add skill type metadata to split actionable/selected (left) vs passive (right) columns.
  // TODO: Replace alphabetical sort with a deliberate skill ordering strategy.
  // TODO: Test soft-locking builds when attributes change and skill requirements are no longer met.
  const sortedSkills = sortSkillsForDisplay(skills);
  const [collapsedSections, setCollapsedSections] = React.useState({
    basic: false,
    actionable: false,
    passive: false,
  });
  const groupedSkills = sortedSkills.reduce(
    (acc, skill) => {
      const group = getSkillGroup(skill);
      acc[group].push(skill);
      return acc;
    },
    { basic: [], actionable: [], passive: [] } as Record<
      'basic' | 'actionable' | 'passive',
      SkillEntity[]
    >
  );

  const formatAbilityModifier = (ability?: SkillEntity['abilityModifier']) =>
    ability ? `${ability.toUpperCase()} Modifier` : null;

  return (
    <div className="space-y-6">
      {(
        [
          { key: 'basic', title: 'Basic Skills' },
          { key: 'actionable', title: 'Actionable Skills' },
          { key: 'passive', title: 'Passive Skills' },
        ] as const
      ).map(({ key, title }) => {
        const groupSkills = groupedSkills[key];
        if (groupSkills.length === 0) return null;
        const isCollapsed = collapsedSections[key];

        return (
          <div key={key} className="panel p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="section-rule flex-1">
                <h3 className="section-title">{title}</h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  setCollapsedSections((prev) => ({
                    ...prev,
                    [key]: !prev[key],
                  }))
                }
                className="text-[11px] font-semibold uppercase tracking-wide rounded-full border border-black/10 px-3 py-1 hover:bg-black/5"
              >
                {isCollapsed ? 'Expand' : 'Minimize'}
              </button>
            </div>
            {!isCollapsed && (
              <div className="columns-1 lg:columns-2 gap-6 mt-4">
              {groupSkills.map((skill) => {
        const tierRows = skill.tiers
          .map((tier) => {
            const tierKey = `${skill.id}:${tier.tier}`;
            const availability = getAvailability(skill, tier.tier);

            const isSelected = currentSelections.some(
              (s) => s.skillId === skill.id && s.tier === tier.tier
            );

            const affordableStatus =
              availability.status === 'available' && !availability.canAfford
                ? 'locked'
                : availability.status;

            if (affordableStatus === 'acquired' && !showAcquired && !isSelected) {
              return null;
            }
            if (affordableStatus === 'locked' && !showLocked) {
              return null;
            }
            if (affordableStatus === 'ineligible' && !showIneligible) {
              return null;
            }

            const spendOptions = getSpendOptions(skill);
            const defaultSpendType = getDefaultSpendType(tierKey, skill);
            const canUseSpendType =
              defaultSpendType === 'core'
                ? skillRemaining.core > 0
                : defaultSpendType === 'utility'
                ? skillRemaining.utility > 0
                : skillRemaining.human > 0;

            const statusLabel =
              affordableStatus === 'available'
                ? 'Available'
                : affordableStatus === 'locked'
                ? 'Locked'
                : affordableStatus === 'ineligible'
                ? 'Ineligible'
                : 'Acquired';

            const prereqLabels = getPrereqLabels(skill, tier.tier);
            const pointRequirement = getPointRequirement(
              skill,
              tier.tier,
              availability
            );

            return (
              <SkillTierRow
                key={tierKey}
                tier={tier}
                hasMultipleTiers={skill.tiers.length > 1}
                statusLabel={statusLabel}
                isSelected={isSelected}
                availability={availability}
                prereqLabels={prereqLabels}
                pointRequirement={pointRequirement}
                spendOptions={spendOptions}
                defaultSpendType={defaultSpendType}
                canUseSpendType={canUseSpendType}
                disableOption={(opt) =>
                  (opt === 'core' && skillRemaining.core <= 0) ||
                  (opt === 'utility' && skillRemaining.utility <= 0) ||
                  (opt === 'human' && skillRemaining.human <= 0)
                }
                onSpendTypeChange={(value) => onSpendTypeChange(tierKey, value)}
                onAdd={() => onAdd(skill.id, tier.tier, defaultSpendType)}
                onRemove={() => onRemove(skill.id, tier.tier)}
              />
            );
          })
          .filter(Boolean);

        if (tierRows.length === 0) return null;

        return (
          <div
            key={skill.id}
            className="mb-3 break-inside-avoid space-y-2 border-b border-black/10 pb-3 last:border-b-0"
          >
            <div className="text-sm font-semibold text-gray-800">
              {skill.name}
              {key === 'basic' && skill.abilityModifier && (
                <span className="ml-2 text-[11px] font-semibold text-(--muted)">
                  {formatAbilityModifier(skill.abilityModifier)}
                </span>
              )}
            </div>
            <div className="space-y-2">{tierRows}</div>
          </div>
        );
              })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
