export function pickI18n(
  value: unknown,
  lang: string,
  fallbackLang = "en",
  fallbackText = "",
) {
  if (!value) return fallbackText;
  if (typeof value === "string") return value;

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const byLang = obj[lang];
    if (typeof byLang === "string") return byLang;

    const byFallback = obj[fallbackLang];
    if (typeof byFallback === "string") return byFallback;
  }

  return fallbackText;
}