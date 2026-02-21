import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { TABLES } from '@/config/dbTables';
import { USER_ROLES } from '@/config/userRoles';
import { Button } from '@/components/ui/Button';
import { allSkills } from '@/data/skills/allSkills';
import { getSkillGroup, getSkillName, sortSkillsForDisplay } from '@/utils/domain/skills';
import { SkillEntity } from '@/types/skills';
import { useUiPreference } from '@/hooks/useUiPreference';

const SKILL_SECTIONS = [
  { key: 'basic', title: 'Basic Skills' },
  { key: 'actionable', title: 'Actionable Skills' },
  { key: 'passive', title: 'Passive Skills' },
] as const;

export default function CampaignHandbookPage() {
  const campaignId = useParams<{ id: string }>().id;
  const navigate = useNavigate();
  const user = useCurrentUser();

  type CampaignMember = { user_id: string };
  type CampaignData = {
    campaign_id: string;
    owner_id: string;
    members: CampaignMember[];
    name: string;
  };

  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPrerequisites, setShowPrerequisites] = useUiPreference(
    'campaignHandbook.skills.showPrerequisites',
    false,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [familyFilter, setFamilyFilter] = useState<'all' | SkillEntity['family']>('all');
  const [pointTypeFilter, setPointTypeFilter] = useState<'all' | SkillEntity['skillPointType']>('all');
  const [expandedSections, setExpandedSections] = useUiPreference(
    'campaignHandbook.skills.expandedSections',
    {
      basic: true,
      actionable: true,
      passive: true,
    },
  );
  const sortedSkills = useMemo(() => sortSkillsForDisplay(allSkills), []);
  const familyOptions = useMemo(
    () => Array.from(new Set(sortedSkills.map((skill) => skill.family))),
    [sortedSkills]
  );
  const filteredSkills = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    return sortedSkills.filter((skill) => {
      if (familyFilter !== 'all' && skill.family !== familyFilter) return false;
      if (pointTypeFilter !== 'all' && skill.skillPointType !== pointTypeFilter) return false;
      if (!needle) return true;
      return (
        skill.name.toLowerCase().includes(needle) ||
        skill.description.toLowerCase().includes(needle)
      );
    });
  }, [sortedSkills, searchQuery, familyFilter, pointTypeFilter]);
  const groupedSkills = useMemo(
    () =>
      filteredSkills.reduce(
        (acc, skill) => {
          const group = getSkillGroup(skill);
          acc[group].push(skill);
          return acc;
        },
        {
          basic: [] as SkillEntity[],
          actionable: [] as SkillEntity[],
          passive: [] as SkillEntity[],
        }
      ),
    [filteredSkills]
  );

  useEffect(() => {
    if (!campaignId || !user) return;

    const fetchCampaign = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from(TABLES.DASHBOARD_CAMPAIGNS)
        .select('campaign_id, owner_id, members, name')
        .eq('campaign_id', campaignId)
        .maybeSingle();

      if (error || !data) {
        alert('Failed to load campaign or unauthorized.');
        navigate('/dashboard');
        return;
      }

      const isMember = data.members.some((m: CampaignMember) => m.user_id === user.id);
      const isOwner = data.owner_id === user.id;
      const isAdmin = user.role === USER_ROLES.ADMIN;

      if (!isMember && !isOwner && !isAdmin) {
        alert('You do not have access to this handbook.');
        navigate('/dashboard');
        return;
      }

      setCampaign(data);
      setLoading(false);
    };

    fetchCampaign();
  }, [campaignId, user, navigate]);

  if (loading) return <p className="p-6">Loading handbook...</p>;
  if (!campaign) return <p className="p-6 text-red-600">Campaign not found.</p>;

  const formatAbilityModifier = (ability?: SkillEntity['abilityModifier']) =>
    ability ? `Ability: ${ability}` : null;
  const formatPrerequisite = (prerequisite: NonNullable<SkillEntity['tiers'][number]['prerequisites']>[number]) => {
    if (prerequisite.type === 'level') return `Level ${prerequisite.minimum}+`;
    if (prerequisite.type === 'attribute') {
      return `${prerequisite.attribute} ${prerequisite.minimum}+`;
    }
    return `${getSkillName(prerequisite.skillId)} T${prerequisite.tier}+`;
  };

  return (
    <main className="max-w-6xl mx-auto p-4">
      <div className="card p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="chip">Campaign Handbook</p>
            <h1 className="text-2xl font-bold mt-2">
              {campaign.name} Handbook
            </h1>
            <p className="text-sm text-(--muted) mt-1">
              Rules, lore, and quick references for your campaign.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(`/campaign/${campaignId}`)}
          >
            Back to Campaign
          </Button>
        </div>

        <div className="section-gap panel p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Skills Reference</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-black/10 bg-black/7 px-2 py-1 text-xs font-medium hover:bg-black/11"
                onClick={() => setShowPrerequisites((prev) => !prev)}
              >
                {showPrerequisites ? 'Hide Prerequisites' : 'Show Prerequisites'}
              </button>
              <p className="text-xs text-(--muted)">
                {filteredSkills.length} / {sortedSkills.length} skills
              </p>
            </div>
          </div>
          <p className="text-sm text-(--muted) mt-1">
            Compact balance view. Skills and tiers are rendered directly from game data.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skill name or description"
              className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm md:col-span-2"
            />
            <select
              value={familyFilter}
              onChange={(e) =>
                setFamilyFilter(e.target.value as 'all' | SkillEntity['family'])
              }
              className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm"
            >
              <option value="all">All families</option>
              {familyOptions.map((family) => (
                <option key={family} value={family}>
                  {family}
                </option>
              ))}
            </select>
            <select
              value={pointTypeFilter}
              onChange={(e) =>
                setPointTypeFilter(
                  e.target.value as 'all' | SkillEntity['skillPointType']
                )
              }
              className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm"
            >
              <option value="all">All point types</option>
              <option value="core">core</option>
              <option value="utility">utility</option>
            </select>
          </div>

          {SKILL_SECTIONS.map(({ key, title }) => {
            const skills = groupedSkills[key as keyof typeof groupedSkills];
            if (skills.length === 0) return null;
            const isExpanded = expandedSections[key];

            return (
              <section key={key} className="mt-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold">{title}</h3>
                  <button
                    type="button"
                    className="rounded-md border border-black/10 bg-black/7 px-2 py-1 text-xs font-medium hover:bg-black/11"
                    onClick={() =>
                      setExpandedSections((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                  >
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </button>
                </div>

                {isExpanded && (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {skills.map((skill) => (
                      <article key={skill.id} className="card p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold leading-tight">{skill.name}</h4>
                            <p className="text-xs text-(--muted) mt-1">
                              {skill.family} · {skill.skillPointType}
                            </p>
                            {formatAbilityModifier(skill.abilityModifier) && (
                              <p className="text-xs text-(--muted)">
                                {formatAbilityModifier(skill.abilityModifier)}
                              </p>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-(--muted) mt-2">{skill.description}</p>

                        <div className="mt-3 space-y-2">
                          {skill.tiers.map((tier) => (
                            <div key={`${skill.id}-${tier.tier}`} className="panel p-2">
                              <p className="text-xs font-semibold">
                                T{tier.tier} · {tier.name}
                              </p>
                              <p className="text-xs text-(--muted) mt-1">
                                {tier.totalDescription ?? tier.description ?? 'No description yet.'}
                              </p>
                              {showPrerequisites && (
                                <div className="mt-1 text-xs text-(--muted)">
                                  <span className="font-medium">Prerequisites:</span>{' '}
                                  {tier.prerequisites?.length
                                    ? tier.prerequisites.map(formatPrerequisite).join(' • ')
                                    : 'None'}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
