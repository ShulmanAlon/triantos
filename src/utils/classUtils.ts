import { classes } from '../data/classes';
import { ClassId } from '../types/gameClass';

export function getClassNameById(classId: ClassId): string {
  const found = classes.find((cls) => cls.id === classId);
  return found ? found.name : classId; // fallback to ID if not found
}
