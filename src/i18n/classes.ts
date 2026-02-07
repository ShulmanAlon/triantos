import { ClassId } from '@/types/gameClass';
import { Language } from '@/types/i18n';

type LocalizedClassInfo = {
  name: string;
  description: string;
  specialAbilities: string[];
  restrictions: string[];
};

export const classDictionary: Record<
  ClassId,
  Record<Language, LocalizedClassInfo>
> = {
  Fighter: {
    en: {
      name: 'Fighter',
      description: 'Brave and powerful warriors skilled in physical combat.',
      specialAbilities: ['Extra attacks', 'Weapon specialization'],
      restrictions: ['Cannot cast spells'],
    },
    he: {
      name: 'לוחם',
      description: 'לוחמים אמיצים וחזקים המומחים בלחימה פיזית.',
      specialAbilities: ['התקפות נוספות', 'התמחות בנשק'],
      restrictions: ['לא יכולים להטיל לחשים'],
    },
  },
  MagicUser: {
    en: {
      name: 'Magic User',
      description: 'Masters of arcane spells and magical lore.',
      specialAbilities: ['Spellcasting', 'Magical research'],
      restrictions: [
        'Cannot use large weapons',
        'Cannot use heavy weapons',
        'Cannot use very heavy weapons',
        'Cannot use armor',
      ],
    },
    he: {
      name: 'קוסם',
      description: 'שליטים על קסם עתיק וידע מסתורי.',
      specialAbilities: ['הטלת לחשים', 'מחקר קסום'],
      restrictions: [
        'לא משתמשים בנשקים גדולים',
        'לא משתמשים בנשקים כבדים',
        'לא משתמשים בנשקים כבדים מאוד',
        'לא משתמשים בשריון',
      ],
    },
  },
  Cleric: {
    en: {
      name: 'Cleric',
      description: 'Divine warriors who heal and protect with holy power.',
      specialAbilities: ['Turn undead', 'Divine spells'],
      restrictions: ['Cannot use slashing or piercing weapons'],
    },
    he: {
      name: 'כהן',
      description: 'לוחמים קדושים שמרפאים ומגנים בעזרת כוחות עליונים.',
      specialAbilities: ['גירוש אל-מתים', 'לחשים קדושים'],
      restrictions: ['לא משתמשים בנשקים חותכים או דוקרים'],
    },
  },
};
