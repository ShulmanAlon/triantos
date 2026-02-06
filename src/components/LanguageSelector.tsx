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
        className="px-3 py-2 border border-black/10 rounded-xl text-sm bg-white/80"
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
