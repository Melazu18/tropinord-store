/**
 * LanguageSwitcher
 * Small dropdown for changing UI language.
 *
 * IMPORTANT for localized routes:
 * - Updates i18n language
 * - Updates URL prefix: /:lang/...
 */
import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { supportedLanguages, type SupportedLanguage } from "@/i18n/resources";
import { normalizeSupportedLang } from "@/utils/getLocalizedPath";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function isSupportedLanguage(value?: string): value is SupportedLanguage {
  if (!value) return false;
  const set = new Set(supportedLanguages.map((l) => l.code));
  return set.has(value as SupportedLanguage);
}

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Prefer URL lang (/:lang/...), fallback to i18n
  const current = useMemo(() => {
    const fromUrl = (lang || "").slice(0, 2).toLowerCase();
    if (isSupportedLanguage(fromUrl)) return fromUrl;
    return normalizeSupportedLang(i18n.language);
  }, [lang, i18n.language]);

  const onValueChange = async (value: SupportedLanguage) => {
    const next = normalizeSupportedLang(value);

    // 1) Change i18n language
    if (i18n.language !== next) {
      await i18n.changeLanguage(next);
    }

    // 2) Rewrite URL from "/sv/..." -> "/en/..." while keeping the rest + querystring
    const parts = location.pathname.split("/").filter(Boolean); // e.g. ["sv","explore"]
    const supportedSet = new Set(supportedLanguages.map((l) => l.code));

    if (parts.length > 0 && supportedSet.has(parts[0] as SupportedLanguage)) {
      parts[0] = next;
      navigate(`/${parts.join("/")}${location.search}`, { replace: true });
    } else {
      // If somehow user is on "/" or non-localized route, send to localized home
      navigate(`/${next}${location.search}`, { replace: true });
    }
  };

  return (
    <Select value={current} onValueChange={(v) => void onValueChange(v as SupportedLanguage)}>
      <SelectTrigger className="h-9 w-[140px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>

      <SelectContent>
        {supportedLanguages.map((l) => (
          <SelectItem key={l.code} value={l.code}>
            {l.nativeLabel}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
