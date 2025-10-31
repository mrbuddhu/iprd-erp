import translations from '../data/translations.json';
import { useLanguage } from '../context/LanguageContext';

export const useTranslations = () => {
  const { language } = useLanguage();
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
  return { t, language };
};

