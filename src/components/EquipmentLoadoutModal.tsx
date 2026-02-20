import { useEffect, useMemo, useState } from 'react';
import {
  CharacterDerivedStats,
  EquipmentLoadouts,
  EquipmentLoadout,
  EquipmentSlotKey,
} from '@/types/characters';
import { GameItem } from '@/types/items';
import { Button } from './ui/Button';
import { getProficiencyToggleKey } from '@/utils/domain/modifiers';
import { getItemRestrictionReasons, isItemAllowed } from '@/utils/domain/itemRestrictions';
import { AttributeMap } from '@/types/attributes';
import { ClassId } from '@/types/gameClass';
import { RaceId } from '@/types/race';

type Props = {
  isOpen: boolean;
  equipmentLoadouts: EquipmentLoadouts;
  selectedLoadoutId: string;
  items: GameItem[];
  onClose: () => void;
  onSave: (next: EquipmentLoadouts) => void | Promise<void>;
  derived?: CharacterDerivedStats | null;
  characterClassId?: ClassId;
  characterRaceId?: RaceId;
  characterAttributes?: AttributeMap;
};

const SLOT_LABELS: Record<EquipmentSlotKey, string> = {
  armor: 'Armor',
  weapon_primary: 'Weapon (Primary)',
  shield: 'Shield',
  energy_shield: 'Energy Shield',
};
// TODO: Add energy shield slot selection in loadouts.

export default function EquipmentLoadoutModal({
  isOpen,
  equipmentLoadouts,
  selectedLoadoutId,
  items,
  onClose,
  onSave,
  derived = null,
  characterClassId,
  characterRaceId,
  characterAttributes,
}: Props) {
  const sortByOrder = (a: GameItem, b: GameItem) => {
    const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  };

  const [loadouts, setLoadouts] = useState<EquipmentLoadout[]>(
    equipmentLoadouts.loadouts
  );

  useEffect(() => {
    if (!isOpen) return;
    setLoadouts(equipmentLoadouts.loadouts);
  }, [equipmentLoadouts, isOpen]);

  const activeLoadout = loadouts.find((l) => l.id === selectedLoadoutId);

  const armorItems = useMemo(
    () => items.filter((i) => i.type === 'armor').sort(sortByOrder),
    [items]
  );
  const weaponItems = useMemo(
    () => items.filter((i) => i.type === 'weapon').sort(sortByOrder),
    [items]
  );
  const unarmedWeapon = useMemo(
    () => weaponItems.find((item) => item.id === 'unarmed') ?? null,
    [weaponItems]
  );
  const shieldItems = useMemo(
    () =>
      items
        .filter((i) => i.type === 'shield' && !i.tags.includes('energyShield'))
        .sort(sortByOrder),
    [items]
  );
  const energyShieldItems = useMemo(
    () => items.filter((i) => i.tags.includes('energyShield')).sort(sortByOrder),
    [items]
  );
  // TODO: Add items order logic (weapons, armor, shield, energy shield).

  const isProficient = (item: GameItem | undefined | null) => {
    const requires = item?.requiresProficiency ?? [];
    if (requires.length === 0) return true;
    return requires.every((req) => {
      return !!derived?.toggles[getProficiencyToggleKey(req)];
    });
  };

  const updateActiveLoadout = (
    updater: (loadout: EquipmentLoadout) => EquipmentLoadout
  ) => {
    setLoadouts((prev) =>
      prev.map((loadout) =>
        loadout.id === selectedLoadoutId ? updater(loadout) : loadout
      )
    );
  };

  const primaryWeaponId = activeLoadout?.items['weapon_primary'] ?? null;
  const primaryWeapon = weaponItems.find((i) => i.id === primaryWeaponId);
  const isTwoHanded = primaryWeapon?.tags.includes('2h') ?? false;
  const armorItem = armorItems.find(
    (i) => i.id === activeLoadout?.items['armor']
  );
  const shieldItem = shieldItems.find(
    (i) => i.id === activeLoadout?.items['shield']
  );
  const armorInvalid = armorItem && !isProficient(armorItem);
  const shieldInvalid = shieldItem && !isProficient(shieldItem);
  const restrictionContext = {
    classId: characterClassId,
    raceId: characterRaceId,
    attributes: characterAttributes,
    armorItem,
  };

  const updateLoadoutItem = (slot: EquipmentSlotKey, itemId: string | null) => {
    updateActiveLoadout((loadout) => {
      const nextItems = { ...loadout.items, [slot]: itemId };
      if (slot === 'weapon_primary' && itemId) {
        const selected = weaponItems.find((i) => i.id === itemId);
        if (selected?.tags.includes('2h')) {
          nextItems['shield'] = null;
        }
      }
      return { ...loadout, items: nextItems };
    });
  };

  const save = async () => {
    await onSave({ activeId: equipmentLoadouts.activeId, loadouts });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow max-w-lg w-full space-y-4">
        <h3 className="text-lg font-semibold">Edit Equipment Loadout</h3>

        <div className="text-sm text-(--muted)">
          Editing: {activeLoadout?.name ?? 'Loadout'}
        </div>

        <label className="flex flex-col gap-1 text-sm">
          Loadout Name
          <input
            className="border rounded px-2 py-1"
            value={activeLoadout?.name ?? ''}
            onChange={(e) =>
              updateActiveLoadout((loadout) => ({
                ...loadout,
                name: e.target.value,
              }))
            }
            placeholder={selectedLoadoutId.replace('-', ' ') || 'Loadout'}
          />
        </label>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <label className="flex flex-col gap-1">
            {SLOT_LABELS.armor}
            <select
              className="border rounded px-2 py-1"
              value={activeLoadout?.items['armor'] ?? 'clothing'}
              onChange={(e) =>
                updateLoadoutItem('armor', e.target.value || null)
              }
            >
              {armorItems.map((item) => {
                const allowedByRules = isItemAllowed(item, restrictionContext);
                const allowed = allowedByRules && isProficient(item);
                const restrictionReasons = allowedByRules
                  ? null
                  : getItemRestrictionReasons(item, restrictionContext);
                return (
                  <option key={item.id} value={item.id} disabled={!allowed}>
                    {item.name}
                    {!allowed && restrictionReasons
                      ? ' (restricted)'
                      : !allowed
                      ? ' (no proficiency)'
                      : ''}
                  </option>
                );
              })}
            </select>
            {armorInvalid && (
              <span className="text-xs text-red-600">
                No proficiency for selected armor.
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1">
            {SLOT_LABELS.shield}
            <select
              className="border rounded px-2 py-1"
              value={activeLoadout?.items['shield'] ?? ''}
              onChange={(e) =>
                updateLoadoutItem('shield', e.target.value || null)
              }
              disabled={isTwoHanded}
            >
              <option value="">No Shield</option>
              {shieldItems.map((item) => {
                const allowedByRules = isItemAllowed(item, restrictionContext);
                const allowed = allowedByRules && isProficient(item);
                const restrictionReasons = allowedByRules
                  ? null
                  : getItemRestrictionReasons(item, restrictionContext);
                return (
                  <option key={item.id} value={item.id} disabled={!allowed}>
                    {item.name}
                    {!allowed && restrictionReasons
                      ? ' (restricted)'
                      : !allowed
                      ? ' (no proficiency)'
                      : ''}
                  </option>
                );
              })}
            </select>
            {shieldInvalid && (
              <span className="text-xs text-red-600">
                No proficiency for selected shield.
              </span>
            )}
            {isTwoHanded && (
              <span className="text-xs text-(--muted)">
                Not applicable with 2h weapon.
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1">
            {SLOT_LABELS.energy_shield}
            <select
              className="border rounded px-2 py-1"
              value={activeLoadout?.items['energy_shield'] ?? ''}
              onChange={(e) =>
                updateLoadoutItem('energy_shield', e.target.value || null)
              }
            >
              <option value="">No Energy Shield</option>
              {energyShieldItems.map((item) => {
                const allowedByRules = isItemAllowed(item, restrictionContext);
                const allowed = allowedByRules && isProficient(item);
                const restrictionReasons = allowedByRules
                  ? null
                  : getItemRestrictionReasons(item, restrictionContext);
                return (
                  <option key={item.id} value={item.id} disabled={!allowed}>
                    {item.name}
                    {!allowed && restrictionReasons
                      ? ' (restricted)'
                      : !allowed
                      ? ' (no proficiency)'
                      : ''}
                  </option>
                );
              })}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            {SLOT_LABELS.weapon_primary}
            <select
              className="border rounded px-2 py-1"
              value={activeLoadout?.items['weapon_primary'] ?? ''}
              onChange={(e) =>
                updateLoadoutItem('weapon_primary', e.target.value || null)
              }
            >
              <option value={unarmedWeapon?.id ?? ''}>
                {unarmedWeapon?.name ?? 'Unarmed'}
              </option>
              {weaponItems.map((item) => {
                if (item.id === 'unarmed') return null;
                const allowed = isItemAllowed(item, restrictionContext);
                const handTag = item.tags.includes('2h')
                  ? '2h'
                  : item.tags.includes('1h')
                  ? '1h'
                  : null;
                return (
                  <option key={item.id} value={item.id} disabled={!allowed}>
                    {item.name}
                    {handTag ? ` (${handTag})` : ''}
                    {!allowed ? ' (restricted)' : ''}
                  </option>
                );
              })}
            </select>
          </label>

          <div />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </div>
      </div>
    </div>
  );
}
