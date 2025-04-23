import i18n from 'i18next';
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import {initReactI18next} from 'react-i18next'

// the translations
const languages = ['ua','en','es','ja','de'];
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: languages,
    fallbackLng: 'ua',
    debug: false,
    react: {
      useSuspense: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    detection: {
      order: ['cookie', 'localStorage'],
      caches: ['cookie'],
    },
  })

export default i18n;