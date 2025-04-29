import { attackSkillFamilies } from './families/attackFamilies';
import { defenseSkillFamilies } from './families/defenseFamilies';
// Later you can import more when you have more families

export const skillFamilies = [
  ...defenseSkillFamilies,
  ...attackSkillFamilies,
  // add more families here
];
