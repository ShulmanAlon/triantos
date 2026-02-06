import { useLanguage } from '@/context/LanguageContext';
import { Language, SUPPORTED_LANGUAGES } from '@/types/i18n';

const languageLabels: Record<Language, string> = {
  en: 'English',
  he: 'עברית',
};

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="h-9 px-4 border border-black/10 rounded-lg text-sm font-semibold bg-black/5 text-(--ink) hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-(--accent)/30"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {languageLabels[lang]}
          </option>
        ))}
      </select>
    </div>
  );
};
