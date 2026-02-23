import { supportedLanguages, type SupportedLanguage } from "@/i18n/resources";

function normalizeLang(input?: string): SupportedLanguage {
  const l = (input || "en").slice(0, 2).toLowerCase() as SupportedLanguage;
  const supported = new Set(supportedLanguages.map((x) => x.code));
  return (supported.has(l) ? l : "en") as SupportedLanguage;
}

export function getLocalizedPath(
  key: string,
  lang?: string,
  params?: Record<string, string | number>
): string {
  const l = normalizeLang(lang);

  const base: Record<string, string> = {
    home: `/${l}`,
    explore: `/${l}/explore`,
    about: `/${l}/about`,
    story: `/${l}/story`,
    faq: `/${l}/faq`,
    privacy: `/${l}/privacy`,
    contact: `/${l}/contact`,
    wholesale: `/${l}/wholesale`,
    checkout: `/${l}/checkout`,
    orders: `/${l}/orders`,
    converter: `/${l}/converter`,
    login: `/${l}/login`,
    product: `/${l}/product/:slug`,
  };

  let path = base[key] ?? `/${l}/${key}`;

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      path = path.replace(`:${k}`, encodeURIComponent(String(v)));
    }
  }

  return path;
}

export function normalizeSupportedLang(lang?: string): SupportedLanguage {
  return normalizeLang(lang);
}
