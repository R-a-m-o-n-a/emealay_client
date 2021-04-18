import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translation_en_GB from './translations/en-GB.translation.json';
import translation_en_US from './translations/en-US.translation.json';
import translation_fr_FR from './translations/fr-FR.translation.json';
import translation_de from './translations/de.translation.json';
import translation_es from './translations/es.translation.json';
import translation_it from './translations/it.translation.json';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en_GB: {
    translation: translation_en_GB,
    description: 'English (Great Britain)',
  },
  en_US: {
    translation: translation_en_US,
    description: 'English (USA)',
  },
  de: {
    translation: translation_de,
    description: 'Deutsch',
  },
  es: {
    translation: translation_es,
    description: 'Español',
  },
  it: {
    translation: translation_it,
    description: 'Italiano',
  },
  fr_FR: {
    translation: translation_fr_FR,
    description: 'Français',
  },
};

const allLanguages = [];
for (const [key, value] of Object.entries(resources)) {
  allLanguages.push({ key, description: value.description });
}

export { allLanguages };

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    // lng: "en",
    fallbackLng: "en",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
