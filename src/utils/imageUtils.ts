import { ClassId } from '../types/gameClass';

export function getCharacterImage(
  imageUrl?: string,
  classId?: ClassId
): string {
  if (imageUrl) return imageUrl;

  const placeholderMap: Record<ClassId, string> = {
    Fighter: '/images/placeholders/fighter.png',
    Cleric: '/images/placeholders/cleric.png',
    MagicUser: '/images/placeholders/magic-user.png',
  };

  return classId ? placeholderMap[classId] : '/images/placeholders/default.png';
}

export function getBlurPlaceholder(classId?: ClassId): string | undefined {
  const blurMap: Record<ClassId, string> = {
    Fighter: '/images/placeholders/blur-fighter.png',
    Cleric: '/images/placeholders/blur-cleric.png',
    MagicUser: '/images/placeholders/blur-magic-user.png',
  };

  return classId ? blurMap[classId] : undefined;
}
