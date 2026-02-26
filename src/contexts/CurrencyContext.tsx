import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const CURRENCIES = [
  "SEK",
  "EUR",
  "USD",
  "GBP",
  "NOK",
  "DKK",
  "CHF",
  "KES",
  "TZS",
  "UGX",
] as const;

export type Currency = (typeof CURRENCIES)[number];

const STORAGE_KEY = "tropinord:currency";

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function normalizeCurrency(input?: string | null): Currency {
  const v = (input || "").toUpperCase();
  return (CURRENCIES as readonly string[]).includes(v)
    ? (v as Currency)
    : "SEK";
}

function canUseDOM() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // ✅ SSR-safe initial state (no localStorage access here)
  const [currency, setCurrencyState] = useState<Currency>("SEK");

  // ✅ Hydrate from localStorage on client
  useEffect(() => {
    if (!canUseDOM()) return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setCurrencyState(normalizeCurrency(stored));
  }, []);

  // ✅ Write changes to localStorage
  useEffect(() => {
    if (!canUseDOM()) return;
    window.localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  // ✅ Keep multiple tabs in sync (optional but useful)
  useEffect(() => {
    if (!canUseDOM()) return;

    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      setCurrencyState(normalizeCurrency(e.newValue));
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ✅ Always normalize / guard
  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(normalizeCurrency(next));
  }, []);

  const value = useMemo(
    () => ({ currency, setCurrency }),
    [currency, setCurrency],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx)
    throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
