import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const languages = ['ua', 'en', 'sk', 'de', 'ja'];
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: languages,
    fallbackLng: 'ua',
    debug: false,
    react: {
      useSuspense: true,
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    detection: {
      order: ['cookie', 'localStorage'],
      caches: ['cookie'],
    },
  });

export default i18n;