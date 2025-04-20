import { useLanguage } from '../context/LanguageContext';

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'he' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="ml-auto mb-4 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
    >
      {language === 'en' ? 'עברית' : 'English'}
    </button>
  );
};
