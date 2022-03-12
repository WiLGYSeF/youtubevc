import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translations_en from './locales/en/translations.json';

const options = {
  fallbackLng: 'en',
  lng: 'en',
  resources: {
    en: {
      translations: translations_en,
    },
  },
  ns: ['translations'],
  defaultNS: 'translations',
};

i18n.use(initReactI18next).init(options);

i18n.languages = Object.keys(options.resources);

export default i18n;
