/**
 * i18n bootstrap
 *
 * - Adds language support: Swedish, English, Arabic, French, German, Swahili.
 * - Uses URL path (/:lang/...), then localStorage, then navigator.
 * - Best-effort location hint via timezone/country (no hard dependency).
 * - Sets <html lang> and <html dir> for RTL languages.
 */
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import {
  resources,
  rtlLanguages,
  supportedLanguages,
  type SupportedLanguage,
  NAMESPACES,
} from "./resources";

const STORAGE_KEY = "tropinord:lang";

function isSupported(lang: string): lang is SupportedLanguage {
  return (supportedLanguages.map((l) => l.code) as string[]).includes(lang);
}

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

    defaultNS: "common",
    ns: [...NAMESPACES],

    interpolation: { escapeValue: false },
    supportedLngs: supportedLanguages.map((l) => l.code),

    detection: {
      // ✅ IMPORTANT for routes like /sv/b2b, /en/explore, etc.
      order: ["path", "localStorage", "navigator", "htmlTag"],
      lookupFromPathIndex: 0,

      lookupLocalStorage: STORAGE_KEY,
      caches: ["localStorage"],
    },

    react: { useSuspense: false },
  });

// Apply initial lang/dir as soon as possible.
const initial = ((): SupportedLanguage => {
  // Prefer language from URL path first: /sv/..., /en/...
  try {
    const seg0 = window.location.pathname.split("/").filter(Boolean)[0] || "";
    const fromPath = seg0.split("-")[0]; // "sv-SE" -> "sv"
    if (fromPath && isSupported(fromPath)) return fromPath;
  } catch {
    // ignore
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && isSupported(saved)) return saved;

  const tzGuess = guessFromTimezone();
  if (tzGuess) {
    localStorage.setItem(STORAGE_KEY, tzGuess);
    return tzGuess;
  }

  const nav = (navigator.languages?.[0] || navigator.language || "en").split(
    "-",
  )[0];

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