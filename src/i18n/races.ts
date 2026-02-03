import { Language } from '@/types/i18n';
import { RaceId } from '@/types/race';

type LocalizedRaceInfo = {
  name: string;
  description: string;
  specialAbilities: string[];
  restrictions: string[];
};

export const raceDictionary: Record<
  RaceId,
  Record<Language, LocalizedRaceInfo>
> = {
  Human: {
    en: {
      name: 'Human',
      description: `Greedy, cunning and power hungry, humans are the most influential and numerous race in The Exile even though they are the shortest lived. Very adaptable. Standing 1.5 up to 2.20 meters tall. Life expectancy ~80 years`,
      specialAbilities: ['Quick learner (+1 skill on levels 3,6,9,12)'],
      restrictions: ['None'],
    },
    he: {
      name: 'אדם',
      description: `חמדנים, ערמומיים וצמאי כוח – בני האדם הם הגזע הדומיננטי ביותר בגולים, למרות אורך חייהם הקצר. מסתגלים מהר. גובה ממוצע 1.5 עד 2.20 מטר. תוחלת חיים ~80 שנה`,
      specialAbilities: ['לומדים מהר (+1 מיומנות בדרגות 3,6,9,12)'],
      restrictions: ['אין'],
    },
  },
  Elf: {
    en: {
      name: 'Elf',
      description: `The seemingly immortal elves are a proud, elegant race with an affinity to magic and nature. Slow to change and learn. Their slender bodies are nimble yet not as durable or strong as humans. Standing 1.40 up to 1.60 meters tall. Life expectancy ~800 years`,
      specialAbilities: [
        'Magic affinity (+1 to magic dice rolls)',
        'Immunity to paralysis and sleep',
        'Darkvision (30m)',
      ],
      restrictions: ['Cannot use heavy weapons without power armor'],
    },
    he: {
      name: 'אלף',
      description: `גזע אלגנטי וגאה עם חיבור עמוק לטבע ולקסם. כמעט בני אלמוות, אך לומדים לאט ומשתנים באיטיות. בעלי גוף רזה, זריז אך פחות חזק או עמיד מבני אדם. גובה ממוצע 1.40 עד 1.60 מטר. תוחלת חיים ~800 שנה`,
      specialAbilities: [
        'חיבור לקסם (+1 לגלגולי קוביות קסם)',
        'חסינות לשיתוק ולשינה',
        'ראיית חושך (30 מטר)',
      ],
      restrictions: ['לא יכולים להשתמש בנשקים כבדים ללא שריון כוח'],
    },
  },
  Dwarf: {
    en: {
      name: 'Dwarf',
      description: `Stout, short and very proud race that seems to flourish underground. Strong warriors, builders and miners. Dwarves have a resistance against magic. Standing 1.10 up to 1.30 meters tall. Life expectancy ~160 years`,
      specialAbilities: [
        'Magic resistance: +1 on saving throws vs spells',
        'Level 11: Half damage from magic effects',
        'Darkvision (30m)',
      ],
      restrictions: ['Cannot use large items', 'Cannot be a magic user'],
    },
    he: {
      name: 'גמד',
      description: `גזע נמוך, חסון וגאה המצליח במיוחד בסביבות תת-קרקעיות. לוחמים עזים, בונים וכורים מומחים. לגמדים עמידות טבעית לקסם. גובה ממוצע 1.10 עד 1.30 מטר. תוחלת חיים ~160 שנה`,
      specialAbilities: [
        'עמידות לקסם: +1 לגלגולי הצלה נגד לחשים',
        'דרגה 11: נזק מחצי מקסמי אויב',
        'ראיית חושך (30 מטר)',
      ],
      restrictions: ['לא יכולים להשתמש בציוד גדול', 'לא יכולים להיות קוסמים'],
    },
  },
  Halfling: {
    en: {
      name: 'Halfling',
      description: `Playful, lucky and mischievous little humanoids who seem to always find themselves in trouble. Standing 60 to 90 cm tall. Life expectancy ~120 years`,
      specialAbilities: [
        'Lucky criticals: Double damage in 19 and 20 attack rolls (19 only if attack hit)',
      ],
      restrictions: ['Cannot use large items'],
    },
    he: {
      name: 'האלפלינג',
      description: `גזע קטן, שובב ובר מזל, שתמיד מסתבך בצרות. גובה ממוצע 60 עד 90 ס"מ. תוחלת חיים ~120 שנה`,
      specialAbilities: [
        'תקיפות ברות מזל: נזק כפול בגלגולים של 19 ו־20 (19 רק אם ההתקפה פגעה)',
      ],
      restrictions: ['לא יכולים להשתמש בציוד גדול'],
    },
  },
};
