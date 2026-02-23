/**
 * i18n bootstrap
 *
 * - Adds language support: Swedish, English, Arabic, French, German, Swahili.
 * - Uses browser language + localStorage detection.
 * - Best-effort location hint via timezone/country (no hard dependency).
 * - Sets <html lang> and <html dir> for RTL languages.
 */
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { resources, rtlLanguages, supportedLanguages, type SupportedLanguage } from "./resources";

const STORAGE_KEY = "tropinord:lang";

function isSupported(lang: string): lang is SupportedLanguage {
  return (supportedLanguages.map((l) => l.code) as string[]).includes(lang);
}

/**
 * Optional, lightweight hint for Swedish users.
 * If the user's timezone looks Swedish and no language is saved, prefer Swedish.
 */
function guessFromTimezone(): SupportedLanguage | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === "Europe/Stockholm") return "sv";
  } catch {
    // ignore
  }
  return null;
}

function updateHtmlLangDir(lang: string) {
  const html = document.documentElement;
  html.lang = lang;
  html.dir = rtlLanguages.includes(lang as SupportedLanguage) ? "rtl" : "ltr";
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    supportedLngs: supportedLanguages.map((l) => l.code),
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: STORAGE_KEY,
      caches: ["localStorage"],
    },
  });

// Apply initial lang/dir as soon as possible.
const initial = ((): SupportedLanguage => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && isSupported(saved)) return saved;

  const tzGuess = guessFromTimezone();
  if (tzGuess) {
    localStorage.setItem(STORAGE_KEY, tzGuess);
    return tzGuess;
  }

  const nav = (navigator.languages?.[0] || navigator.language || "en").split("-")[0];
  return (isSupported(nav) ? nav : "en") as SupportedLanguage;
})();

if (i18n.language !== initial) {
  void i18n.changeLanguage(initial);
}
updateHtmlLangDir(i18n.language);

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
  updateHtmlLangDir(lng);
});

export default i18n;
