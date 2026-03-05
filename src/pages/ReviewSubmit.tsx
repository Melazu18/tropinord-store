import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { supabase } from "@/integrations/supabase/client";
import {
  normalizeSupportedLang,
  getLocalizedPath,
} from "@/utils/getLocalizedPath";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type OrderedItem = {
  product_id: string;
  title: string;
  quantity: number;
};

type ResolveResponse = {
  ok: boolean;
  error?: string;
  order_number?: string;
  items?: OrderedItem[];
  suggested_name?: string | null;
  suggested_country?: string | null;
};

export default function ReviewSubmit() {
  const { t, i18n } = useTranslation(["common"]);
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = useMemo(
    () => normalizeSupportedLang(langParam || i18n.language || "en"),
    [langParam, i18n.language],
  );

  const [params] = useSearchParams();
  const token = params.get("token") ?? "";

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [items, setItems] = useState<OrderedItem[]>([]);

  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [country, setCountry] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const homePath = getLocalizedPath("home", lang);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!token) {
        setLoadError("Missing review token.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setLoadError(null);

        const { data, error } = await supabase.functions.invoke(
          "resolve-review-token",
          {
            body: { token },
          },
        );

        if (error) throw error;

        const res = data as ResolveResponse;
        if (!res?.ok) {
          setLoadError(res?.error ?? "Invalid or expired token.");
          setLoading(false);
          return;
        }

        const its = res.items ?? [];
        if (!mounted) return;

        setOrderNumber(res.order_number ?? null);
        setItems(its);

        if (its[0]?.product_id) setProductId(its[0].product_id);

        if (res.suggested_name) setCustomerName(res.suggested_name);
        if (res.suggested_country) setCountry(res.suggested_country);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setLoadError("Could not load review form.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  const selectedItem = useMemo(
    () => items.find((x) => x.product_id === productId) ?? null,
    [items, productId],
  );

  const canSubmit =
    !!token &&
    !!productId &&
    rating >= 1 &&
    rating <= 5 &&
    customerName.trim().length > 0 &&
    body.trim().length > 0 &&
    !submitting;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setSubmitError(null);

      const { data, error } = await supabase.functions.invoke("submit-review", {
        body: {
          token,
          product_id: productId,
          rating,
          title: title.trim() || null,
          body: body.trim(),
          customer_name: customerName.trim(),
          country: country.trim() || null,
        },
      });

      if (error) throw error;

      if (!data?.ok) {
        setSubmitError(data?.error ?? "Could not submit review.");
        return;
      }

      setSubmitted(true);
    } catch (e: any) {
      console.error(e);
      setSubmitError(e?.message ?? "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="text-muted-foreground">
          {t("common:loading", { defaultValue: "Loading..." })}
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-6 space-y-3">
            <div className="text-lg font-semibold">Review link problem</div>
            <div className="text-sm text-muted-foreground">{loadError}</div>
            <Button asChild className="w-full">
              <Link to={homePath}>Back to home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-6 space-y-3">
            <div className="text-xl font-semibold">Thank you!</div>
            <div className="text-sm text-muted-foreground">
              Your review was submitted and is pending approval.
            </div>

            <div className="grid gap-2">
              <Button asChild className="w-full">
                <Link to={homePath}>Back to home</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to={`/${lang}/reviews`}>See public reviews</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Leave a review</h1>
            <p className="text-sm text-muted-foreground">
              {orderNumber ? (
                <>
                  Order <span className="font-mono">{orderNumber}</span>
                </>
              ) : (
                "Verified purchase"
              )}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Product</Label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                {items.map((it) => (
                  <option key={it.product_id} value={it.product_id}>
                    {it.title} (x{it.quantity})
                  </option>
                ))}
              </select>
              {selectedItem ? (
                <p className="text-xs text-muted-foreground">
                  Reviewing:{" "}
                  <span className="font-medium">{selectedItem.title}</span>
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setRating(n)}
                    className={`h-10 w-10 rounded-md border text-sm font-semibold transition ${
                      rating >= n
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "hover:bg-accent"
                    }`}
                    aria-label={`Rate ${n} star`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating}/5
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerName">First name *</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Leyla"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Turkey"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title (optional)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short headline"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Your review *</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="What did you like? Taste, aroma, texture..."
                rows={5}
                required
              />
            </div>

            {submitError ? (
              <div className="text-sm text-destructive">{submitError}</div>
            ) : null}

            <Button type="submit" className="w-full" disabled={!canSubmit}>
              {submitting ? "Submitting..." : "Submit review"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Reviews are published after approval to prevent spam.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
