import translations from '../data/translations.json';
import { useLanguage } from '../context/LanguageContext';

export const useTranslations = () => {
  const { language } = useLanguage();
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (!value || value === key) {
      return key;
    }
    
    // Replace placeholders like {count}, {type}, etc.
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }
    
    return value;
  };
  return { t, language };
};

