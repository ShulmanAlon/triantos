import { useLanguage } from '@/context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '@/types/i18n';

const languageLabels: Record<string, string> = {
  en: 'English',
  he: 'עברית',
};

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="ml-auto mb-4">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as typeof language)}
        className="px-3 py-1 border border-gray-300 rounded text-sm"
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
