import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translation_en_GB from './translations/en-GB.translation.json';
import translation_en_US from './translations/en-US.translation.json';
import translation_fr_FR from './translations/fr-FR.translation.json';
import translation_de from './translations/de.translation.json';
import translation_es from './translations/es.translation.json';
import translation_it from './translations/it.translation.json';
import translation_ja from './translations/ja.translation.json';

// the translations
/* when adding a new language, check it here https://manage.auth0.com/dashboard/eu/emilia-app/tenant/general
 * ALSO: add the locale to client/src/components/util/DatePicker.jsx
 * and test which shorthand works (for example the Auth0 list says fr-FR but the shorthand that is passed by ui_locales needs to be fr) */
const resources = {
  de: {
    translation: translation_de,
    description: 'Deutsch',
  },
  it: {
    translation: translation_it,
    description: 'Italiano',
  },
  ja: {
    translation: translation_ja,
    description: '日本語',
  },
  fr_FR: {
    translation: translation_fr_FR,
    description: 'Français',
  },
  en_GB: {
    translation: translation_en_GB,
    description: 'English (Great Britain)',
  },
  en_US: {
    translation: translation_en_US,
    description: 'English (USA)',
  },
  es: {
    translation: translation_es,
    description: 'Español',
  },
};

export const languageShorthandForAuth0 = { // for Auth0, see comment above.
  de: 'de',
  it: 'it',
  ja: 'ja',
  fr_FR: 'fr_FR fr', // preference list
  en_GB: 'en',
  en_US: 'en',
  es: 'es',
}


export const languagesISO3 = { // for franc translation package https://www.npmjs.com/package/franc-min?activeTab=readme
  de: 'deu',
  it: 'ita',
  ja: 'jpn',
  fr_FR: 'fra',
  en_GB: 'eng',
  en_US: 'eng',
  es: 'spa',
}

// ISO-639-Code 2-digit code for google Translate API https://cloud.google.com/translate/docs/languages
export const languagesISO2 = {
  de: 'de',
  it: 'it',
  ja: 'ja',
  fr_FR: 'fr',
  en_GB: 'en',
  en_US: 'en',
  es: 'es',
}

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
    fallbackLng: "en_GB",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already saves from xss attacks
    }
  });

export default i18n;
