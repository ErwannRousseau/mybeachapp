import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fr from "./locales/fr.json";

export const DEFAULT_LOCALE = "fr";
export const SUPPORTED_LOCALES = ["fr"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const localeLabels: Record<SupportedLocale, string> = {
  fr: fr.locale.names.fr,
};

i18n.use(initReactI18next).init({
  fallbackLng: DEFAULT_LOCALE,
  initAsync: false,
  interpolation: {
    escapeValue: false,
  },
  lng: DEFAULT_LOCALE,
  react: {
    useSuspense: false,
  },
  resources: {
    fr: {
      translation: fr,
    },
  },
  supportedLngs: SUPPORTED_LOCALES,
});

export { i18n };

export function translate(key: string, options?: Record<string, unknown>) {
  return String(i18n.t(key as never, options as never));
}
