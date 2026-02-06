import { useEffect, useMemo, useState } from 'react';
import {
  CharacterDerivedStats,
  EquipmentLoadouts,
  EquipmentLoadout,
} from '@/types/characters';
import { GameItem } from '@/types/items';
import { Button } from './ui/Button';

type Props = {
  isOpen: boolean;
  equipmentLoadouts: EquipmentLoadouts;
  selectedLoadoutId: string;
  items: GameItem[];
  onClose: () => void;
  onSave: (next: EquipmentLoadouts) => void | Promise<void>;
  derived?: CharacterDerivedStats | null;
};

type SlotKey = 'armor' | 'weapon_primary' | 'weapon_offhand' | 'shield';

const SLOT_LABELS: Record<SlotKey, string> = {
  armor: 'Armor',
  weapon_primary: 'Weapon (Primary)',
  weapon_offhand: 'Weapon (Offhand)',
  shield: 'Shield',
};

export default function EquipmentLoadoutModal({
  isOpen,
  equipmentLoadouts,
  selectedLoadoutId,
  items,
  onClose,
  onSave,
  derived = null,
}: Props) {
  const [loadouts, setLoadouts] = useState<EquipmentLoadout[]>(
    equipmentLoadouts.loadouts
  );

  useEffect(() => {
    if (!isOpen) return;
    setLoadouts(equipmentLoadouts.loadouts);
  }, [equipmentLoadouts, isOpen]);

  const activeLoadout = loadouts.find((l) => l.id === selectedLoadoutId);

  const armorItems = useMemo(
    () => items.filter((i) => i.type === 'armor'),
    [items]
  );
  const weaponItems = useMemo(
    () => items.filter((i) => i.type === 'weapon'),
    [items]
  );
  const offhandWeapons = useMemo(
    () => weaponItems.filter((i) => !i.tags.includes('2h')),
    [weaponItems]
  );
  const shieldItems = useMemo(
    () => items.filter((i) => i.type === 'shield'),
    [items]
  );

  const isProficient = (item: GameItem | undefined | null) => {
    const requires = item?.requiresProficiency ?? [];
    if (requires.length === 0) return true;
    return requires.every((req) => {
      switch (req) {
        case 'armorHeavy':
          return !!derived?.toggles['ac_with_heavyArmor'];
        case 'armorLight':
          return !!derived?.toggles['ac_with_lightArmor'];
        case 'armorPower':
          return !!derived?.toggles['ac_with_powerArmor'];
        case 'armorUnarmored':
          return !!derived?.toggles['ac_with_unarmored'];
        case 'shieldFortress':
          return !!derived?.toggles['ac_with_shield'];
        default:
          return !!derived?.toggles[`proficiency.${req}`];
      }
    });
  };

  const primaryWeaponId = activeLoadout?.items['weapon_primary'] ?? null;
  const primaryWeapon = weaponItems.find((i) => i.id === primaryWeaponId);
  const isTwoHanded = primaryWeapon?.tags.includes('2h') ?? false;
  const armorItem = armorItems.find((i) => i.id === activeLoadout?.items['armor']);
  const shieldItem = shieldItems.find((i) => i.id === activeLoadout?.items['shield']);
  const armorInvalid = armorItem && !isProficient(armorItem);
  const shieldInvalid = shieldItem && !isProficient(shieldItem);

  const updateLoadoutItem = (slot: SlotKey, itemId: string | null) => {
    setLoadouts((prev) =>
      prev.map((loadout) => {
        if (loadout.id !== selectedLoadoutId) return loadout;
        const nextItems = { ...loadout.items, [slot]: itemId };
        if (slot === 'weapon_primary' && itemId) {
          const selected = weaponItems.find((i) => i.id === itemId);
          if (selected?.tags.includes('2h')) {
            nextItems['weapon_offhand'] = null;
            nextItems['shield'] = null;
          }
        }
        return { ...loadout, items: nextItems };
      })
    );
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

        <div className="text-sm text-[var(--muted)]">
          Editing: {activeLoadout?.name ?? 'Loadout'}
        </div>

        <label className="flex flex-col gap-1 text-sm">
          Loadout Name
          <input
            className="border rounded px-2 py-1"
            value={activeLoadout?.name ?? ''}
            onChange={(e) =>
              setLoadouts((prev) =>
                prev.map((loadout) =>
                  loadout.id === selectedLoadoutId
                    ? { ...loadout, name: e.target.value }
                    : loadout
                )
              )
            }
            placeholder={selectedLoadoutId.replace('-', ' ') || 'Loadout'}
          />
        </label>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <label className="flex flex-col gap-1">
            {SLOT_LABELS.armor}
            <select
              className="border rounded px-2 py-1"
              value={activeLoadout?.items['armor'] ?? ''}
              onChange={(e) =>
                updateLoadoutItem('armor', e.target.value || null)
              }
            >
              <option value="">None</option>
              {armorItems.map((item) => {
                const allowed = isProficient(item);
                return (
                  <option key={item.id} value={item.id} disabled={!allowed}>
                    {item.name}
                    {!allowed ? ' (no proficiency)' : ''}
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
              <option value="">None</option>
              {shieldItems.map((item) => {
                const allowed = isProficient(item);
                return (
                  <option key={item.id} value={item.id} disabled={!allowed}>
                    {item.name}
                    {!allowed ? ' (no proficiency)' : ''}
                  </option>
                );
              })}
            </select>
            {shieldInvalid && (
              <span className="text-xs text-red-600">
                No proficiency for selected shield.
              </span>
            )}
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
              <option value="">None</option>
              {weaponItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            {SLOT_LABELS.weapon_offhand}
            <select
              className="border rounded px-2 py-1"
              value={activeLoadout?.items['weapon_offhand'] ?? ''}
              onChange={(e) =>
                updateLoadoutItem('weapon_offhand', e.target.value || null)
              }
              disabled={isTwoHanded}
            >
              <option value="">None</option>
              {offhandWeapons.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
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
