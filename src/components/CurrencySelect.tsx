import * as React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCurrency, CURRENCIES, type Currency } from "@/contexts/CurrencyContext";
import { normalizeSupportedLang } from "@/utils/getLocalizedPath";

export function CurrencySelect() {
  const { t } = useTranslation(["common"]);
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = normalizeSupportedLang(langParam); // ✅ kept (and now stored) for consistency/future use

  const { currency, setCurrency } = useCurrency();

  const getLabel = React.useCallback(
    (code: Currency) =>
      t(`currencies.${code}`, {
        ns: "common",
        defaultValue: code,
      }),
    [t],
  );

  return (
    <div className="space-y-2" data-lang={lang}>
      <Label className="text-sm font-medium">
        {t("currency", { ns: "common", defaultValue: "Currency" })}
      </Label>

      <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
        <SelectTrigger className="w-full sm:w-[280px]">
          <SelectValue placeholder={t("currency", { ns: "common", defaultValue: "Currency" })} />
        </SelectTrigger>

        <SelectContent>
          {CURRENCIES.map((code) => (
            <SelectItem key={code} value={code}>
              {getLabel(code)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <p className="text-xs text-muted-foreground">
        {t("currencyHint", {
          ns: "common",
          defaultValue: "Currency selection is saved for this device.",
        })}
      </p>
    </div>
  );
}