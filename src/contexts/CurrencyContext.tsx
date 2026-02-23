import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export const CURRENCIES = ["SEK", "EUR", "USD", "GBP", "NOK", "DKK", "CHF", "KES", "TZS", "UGX"] as const;
export type Currency = (typeof CURRENCIES)[number];

const STORAGE_KEY = "tropinord:currency";

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function normalizeCurrency(input?: string | null): Currency {
  const v = (input || "").toUpperCase();
  return (CURRENCIES as readonly string[]).includes(v) ? (v as Currency) : "SEK";
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    return normalizeCurrency(localStorage.getItem(STORAGE_KEY));
  });

  const setCurrency = (next: Currency) => setCurrencyState(next);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  const value = useMemo(() => ({ currency, setCurrency }), [currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
