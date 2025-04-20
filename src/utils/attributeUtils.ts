import { attributeEffectDesc, attributeLabels } from '../i18n/attributes';
import { Attribute } from '../types/attributes';
import { Language } from '../types/i18n';

function getPoolPointCostAtOffset(offsetFromBaseline: number): number {
  if (offsetFromBaseline < 2) return 1;
  return Math.trunc((offsetFromBaseline + 2) / 2);
}

export function getPointCostChange(
  from: number,
  to: number,
  baseline: number
): number {
  const distanceLow = from < to ? from - baseline : to - baseline;
  const distanceHigh = from < to ? to - baseline : from - baseline;

  let cost = 0;
  for (let offset = distanceLow + 1; offset <= distanceHigh; offset++) {
    cost += getPoolPointCostAtOffset(Math.abs(offset));
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
