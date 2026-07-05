import { useTranslation } from "react-i18next";

import {
  DEFAULT_LOCALE,
  localeLabels,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "./i18n";

export function useLocale() {
  const { i18n: currentI18n } = useTranslation();
  const currentLocale = isSupportedLocale(currentI18n.language)
    ? currentI18n.language
    : DEFAULT_LOCALE;

  function setLocale(locale: SupportedLocale) {
    void currentI18n.changeLanguage(locale);
  }

  return {
    currentLocale,
    localeLabels,
    setLocale,
    supportedLocales: SUPPORTED_LOCALES,
  };
}

function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}
