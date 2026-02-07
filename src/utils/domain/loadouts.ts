import {
  EquipmentLoadout,
  EquipmentLoadouts,
  EquipmentSlotKey,
} from '@/types/characters';

const DEFAULT_LOADOUT_IDS = [
  'loadout-1',
  'loadout-2',
  'loadout-3',
  'loadout-4',
] as const;

const DEFAULT_LOADOUT_NAMES: Record<(typeof DEFAULT_LOADOUT_IDS)[number], string> = {
  'loadout-1': 'Loadout 1',
  'loadout-2': 'Loadout 2',
  'loadout-3': 'Loadout 3',
  'loadout-4': 'Loadout 4',
};

export const EQUIPMENT_SLOT_KEYS: EquipmentSlotKey[] = [
  'armor',
  'weapon_primary',
  'shield',
  'energy_shield',
];

export const normalizeLoadoutItems = (
  items: EquipmentLoadout['items']
): EquipmentLoadout['items'] => {
  const next: EquipmentLoadout['items'] = { ...items };
  for (const key of EQUIPMENT_SLOT_KEYS) {
    if (!(key in next)) next[key] = null;
  }
  if (!next.weapon_primary) {
    next.weapon_primary = 'unarmed';
  }
  return next;
};

export const normalizeLoadouts = (
  raw: EquipmentLoadouts | null | undefined
): EquipmentLoadouts => {
  const buildDefaultLoadouts = (): EquipmentLoadout[] =>
    DEFAULT_LOADOUT_IDS.map((id) => ({
      id,
      name: DEFAULT_LOADOUT_NAMES[id],
      items: normalizeLoadoutItems({}),
    }));

  if (!raw) {
    return {
      activeId: 'loadout-1',
      loadouts: buildDefaultLoadouts(),
    };
  }

  const loadouts = (raw.loadouts ?? []).map((loadout) => ({
    ...loadout,
    items: normalizeLoadoutItems(loadout.items),
  }));
  const existingIds = new Set(loadouts.map((l) => l.id));
  for (const def of buildDefaultLoadouts()) {
    if (!existingIds.has(def.id)) loadouts.push(def);
  }
  return { activeId: raw.activeId ?? 'loadout-1', loadouts };
};

export const getLoadoutItemId = (
  loadout: EquipmentLoadout | null | undefined,
  slot: EquipmentSlotKey
): string | null => {
  if (!loadout) return null;
  return loadout.items[slot] ?? null;
};

export const getLoadoutDisplayName = (loadout: EquipmentLoadout): string => {
  if (loadout.name && loadout.name.trim().length > 0) return loadout.name;
  if (loadout.id in DEFAULT_LOADOUT_NAMES) {
    return DEFAULT_LOADOUT_NAMES[loadout.id as keyof typeof DEFAULT_LOADOUT_NAMES];
  }
  const suffix = loadout.id.split('-')[1] ?? '';
  return `Loadout ${suffix}`.trim();
};
