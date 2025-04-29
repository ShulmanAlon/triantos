import { attackSkillTiers } from './tiers/attackSkills';
import { defenseSkillTiers } from './tiers/defenseSkills';
// Later you can import more when you have more skills

export const skillTiers = [
  ...defenseSkillTiers,
  ...attackSkillTiers,
  // spread other skill arrays here
];
