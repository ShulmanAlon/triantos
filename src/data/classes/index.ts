import { GameClass } from '../../types/gameClass';
import { Cleric } from './Cleric.ts';
import { MagicUser } from './MagicUser';

export { MagicUser } from './MagicUser';
// export { Fighter } from './Fighter';
export { Cleric } from './Cleric';

export const CLASSES: GameClass[] = [MagicUser, Cleric];
