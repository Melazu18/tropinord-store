import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { PageShell } from "@/components/PageShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CURRENCIES,
  type Currency,
  useCurrency,
} from "@/contexts/CurrencyContext";

type RatesResponse = {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
};

export default function CurrencyConverter() {
  const { currency: preferredCurrency } = useCurrency();

  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState<Currency>("SEK");
  const [to, setTo] = useState<Currency>("EUR");
  const [rates, setRates] = useState<RatesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Make converter follow header currency preference:
  useEffect(() => {
    setFrom(preferredCurrency);
    // Keep "to" reasonable:
    setTo((prev) => (prev === preferredCurrency ? "EUR" : prev));
  }, [preferredCurrency]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = new URL("https://api.frankfurter.app/latest");
        url.searchParams.set("from", from);
        url.searchParams.set("to", to);

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`Rate request failed (${res.status})`);
        const data = (await res.json()) as RatesResponse;
        if (!cancelled) setRates(data);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to fetch rates");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  const numericAmount = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  const converted = useMemo(() => {
    const rate = rates?.rates?.[to] ?? null;
    if (!rate) return null;
    return numericAmount * rate;
  }, [numericAmount, rates, to]);

  return (
    <>
      <Header
        title="Currency Converter"
        subtitle="Indicative FX rates (ECB reference)."
        showLogo={false}
      />
      <main>
        <PageShell className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Convert</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>From</Label>
                <Select
                  value={from}
                  onValueChange={(v) => setFrom(v as Currency)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>To</Label>
                <Select value={to} onValueChange={(v) => setTo(v as Currency)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : isLoading ? (
                <p className="text-sm text-muted-foreground">Loading rates…</p>
              ) : converted === null ? (
                <p className="text-sm text-muted-foreground">
                  No rate available.
                </p>
              ) : (
                <div className="space-y-1">
                  <p className="text-2xl font-semibold">
                    {numericAmount.toLocaleString()} {from} ≈{" "}
                    {converted.toLocaleString(undefined, {
                      maximumFractionDigits: 4,
                    })}{" "}
                    {to}
                  </p>
                  {rates?.date ? (
                    <p className="text-xs text-muted-foreground">
                      Rates date: {rates.date}
                    </p>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        </PageShell>
      </main>
    </>
  );
}
