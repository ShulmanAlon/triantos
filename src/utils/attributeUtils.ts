import { attributeEffectDesc, attributeLabels } from '../i18n/attributes';
import { Attribute } from '@/types/attributes';
import { Language } from '@/types/i18n';

function getPoolPointCostAtOffset(offsetFromBaseline: number): number {
  if (offsetFromBaseline < 2) return 1;
  return Math.trunc((offsetFromBaseline + 2) / 2);
}

export function getPointCostChange(
  from: number,
  to: number,
  baseline: number
): number {
  if (from === to) return 0;
  const step = from < to ? 1 : -1;
  let cost = 0;

  const costForValue = (value: number): number => {
    const offset = value - baseline;
    if (offset <= 0) return 1;
    return getPoolPointCostAtOffset(offset);
  };

  for (let value = from; value !== to; value += step) {
    const next = value + step;
    const referenceValue = step > 0 ? next : value;
    const delta = costForValue(referenceValue);
    cost += step > 0 ? delta : -delta;
  }

  return cost;
}

export const getAttributeNameById = (
  attributeId: Attribute | undefined,
  language: Language
): string => {
  if (!attributeId) return '';
  return attributeLabels[language][attributeId];
};

export const getAttributeEffectDescById = (
  attributeId: Attribute | undefined,
  language: Language
): string => {
  if (!attributeId) return '';
  return attributeEffectDesc[language][attributeId];
};
