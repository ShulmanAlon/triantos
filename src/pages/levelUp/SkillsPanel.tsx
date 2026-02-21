import React from 'react';
import { SkillEntity, SkillPointType } from '@/types/skills';
import { getSkillGroup, sortSkillsForDisplay } from '@/utils/domain/skills';
import { SkillSelectionEntry, SkillPointPool } from '@/types/characters';
import { SkillTierRow } from './SkillTierRow';

type SkillAvailability = {
  status: 'available' | 'locked' | 'ineligible' | 'acquired';
  reasons: string[];
  canAfford: boolean;
};

type SkillsPanelProps = {
  skills: SkillEntity[];
  showAcquired: boolean;
  acquiredThisLevel: Set<string>;
  showLocked: boolean;
  showIneligible: boolean;
  skillRemaining: SkillPointPool;
  currentSelections: SkillSelectionEntry[];
  getTierAvailability: (skill: SkillEntity, tierIndex: number) => SkillAvailability;
  getPrereqLabels: (skill: SkillEntity, tierIndex: number) => { label: string; met: boolean }[];
  getPointRequirement: (skill: SkillEntity, tierIndex: number, availability: SkillAvailability) => string | null;
  getSpendOptions: (skill: SkillEntity) => SkillPointType[];
  getDefaultSpendType: (key: string, skill: SkillEntity) => SkillPointType;
  onSpendTypeChange: (key: string, value: SkillPointType) => void;
  onAdd: (skillId: SkillEntity['id'], tier: number, spendType: SkillPointType) => void;
  onRemove: (skillId: SkillEntity['id'], tier: number) => void;
};

export const SkillsPanel = ({
  skills,
  showAcquired,
  acquiredThisLevel,
  showLocked,
  showIneligible,
  skillRemaining,
  currentSelections,
  getTierAvailability,
  getPrereqLabels,
  getPointRequirement,
  getSpendOptions,
  getDefaultSpendType,
  onSpendTypeChange,
  onAdd,
  onRemove,
}: SkillsPanelProps) => {
  // TODO: Add skill type metadata to split actionable/selected (left) vs passive (right) columns.
  // TODO: Replace alphabetical sort with a deliberate skill ordering strategy.
  // TODO: Test soft-locking builds when attributes change and skill requirements are no longer met.
  const sortedSkills = sortSkillsForDisplay(skills);
  const [collapsedSections, setCollapsedSections] = React.useState({
    basic: false,
    actionable: false,
    passive: false,
  });
  const [showSkillDescriptions, setShowSkillDescriptions] = React.useState(true);
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
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowSkillDescriptions((prev) => !prev)}
          className="text-[11px] font-semibold uppercase tracking-wide rounded-full border border-black/10 px-3 py-1 hover:bg-black/5"
        >
          {showSkillDescriptions ? 'Hide Skill Descriptions' : 'Show Skill Descriptions'}
        </button>
      </div>
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
              const availability = getTierAvailability(skill, tier.tier);

              const isSelected = currentSelections.some(
                (s) => s.skillId === skill.id && s.tier === tier.tier
              );

              const affordableStatus =
                availability.status === 'available' && !availability.canAfford
                  ? 'locked'
                  : availability.status;

              const isAcquiredThisLevel = acquiredThisLevel.has(tierKey);

              if (
                affordableStatus === 'acquired' &&
                !showAcquired &&
                !isSelected &&
                !isAcquiredThisLevel
              ) {
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
            className="mb-3 break-inside-avoid rounded-xl border border-black/10 p-3"
            >
            <div className="text-sm font-semibold text-gray-800">
              {skill.name}
                {key === 'basic' && skill.abilityModifier && (
                  <span className="ml-2 text-[11px] font-semibold text-(--muted)">
                    {formatAbilityModifier(skill.abilityModifier)}
                  </span>
                )}
              </div>
              {showSkillDescriptions && skill.description && (
                <div className="text-xs text-(--muted)">{skill.description}</div>
              )}
              <div className="mt-2 divide-y divide-black/10">{tierRows}</div>
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
