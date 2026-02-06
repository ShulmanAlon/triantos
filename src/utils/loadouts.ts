import { EquipmentLoadout, EquipmentLoadouts, EquipmentSlotKey } from '@/types/characters';

export const EQUIPMENT_SLOT_KEYS: EquipmentSlotKey[] = [
  'armor',
  'weapon_primary',
  'weapon_offhand',
  'shield',
];

export const normalizeLoadoutItems = (
  items: EquipmentLoadout['items']
): EquipmentLoadout['items'] => {
  const next: EquipmentLoadout['items'] = { ...items };
  for (const key of EQUIPMENT_SLOT_KEYS) {
    if (!(key in next)) next[key] = null;
  }
  return next;
};

export const normalizeLoadouts = (
  raw: EquipmentLoadouts | null | undefined
): EquipmentLoadouts => {
  if (!raw) {
    return {
      activeId: 'loadout-1',
      loadouts: [
        { id: 'loadout-1', name: 'Loadout 1', items: normalizeLoadoutItems({}) },
        { id: 'loadout-2', name: 'Loadout 2', items: normalizeLoadoutItems({}) },
        { id: 'loadout-3', name: 'Loadout 3', items: normalizeLoadoutItems({}) },
        { id: 'loadout-4', name: 'Loadout 4', items: normalizeLoadoutItems({}) },
      ],
    };
  }

  const loadouts = (raw.loadouts ?? []).map((loadout) => ({
    ...loadout,
    items: normalizeLoadoutItems(loadout.items),
  }));
  const existingIds = new Set(loadouts.map((l) => l.id));
  const defaults: EquipmentLoadout[] = [
    { id: 'loadout-1', name: 'Loadout 1', items: normalizeLoadoutItems({}) },
    { id: 'loadout-2', name: 'Loadout 2', items: normalizeLoadoutItems({}) },
    { id: 'loadout-3', name: 'Loadout 3', items: normalizeLoadoutItems({}) },
    { id: 'loadout-4', name: 'Loadout 4', items: normalizeLoadoutItems({}) },
  ];
  for (const def of defaults) {
    if (!existingIds.has(def.id)) loadouts.push(def);
  }
  return { activeId: raw.activeId ?? 'loadout-1', loadouts };
};
