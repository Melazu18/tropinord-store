import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ReviewSummary } from "@/components/reviews/ReviewSummary";
import { getLocalizedPath, normalizeSupportedLang } from "@/utils/getLocalizedPath";

type ReviewRow = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  created_at: string | null;
  customer_name?: string | null;
  country?: string | null;
  products?: { slug: string; title: string } | null;
};

export default function Reviews() {
  const { t, i18n } = useTranslation(["common"]);
  const { lang: langParam } = useParams<{ lang?: string }>();

  const lang = useMemo(
    () => normalizeSupportedLang(langParam || i18n.language || "en"),
    [langParam, i18n.language],
  );

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["all-approved-reviews", lang],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
          id,
          rating,
          title,
          body,
          created_at,
          customer_name,
          country,
          products:products ( slug, title )
        `,
        )
        .eq("status", "APPROVED")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as ReviewRow[];
    },
  });

  const ratings = useMemo(() => reviews.map((r) => Number(r.rating ?? 0)), [reviews]);

  const homePath = getLocalizedPath("home", lang);
  const productPath = (slug: string) => getLocalizedPath("product", lang, { slug });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-muted-foreground">{t("common:loading", { defaultValue: "Loading..." })}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer reviews</h1>
          <p className="text-muted-foreground">Ratings and experiences from customers.</p>
          <Link to={homePath} className="text-sm text-muted-foreground hover:underline">
            ← Back to home
          </Link>
        </div>

        <ReviewSummary ratings={ratings} count={reviews.length} />
      </div>

      <div className="grid gap-4">
        {reviews.map((r) => {
          const stars = "★".repeat(Math.max(0, Math.min(5, Number(r.rating ?? 0))));
          const date = r.created_at ? new Date(r.created_at).toLocaleDateString() : "";

          return (
            <div key={r.id} className="rounded-xl border bg-background p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold">{stars}</div>
                  {r.title ? <div className="mt-1 font-medium">{r.title}</div> : null}
                </div>

                {date ? <div className="text-xs text-muted-foreground whitespace-nowrap">{date}</div> : null}
              </div>

              {r.body ? <p className="mt-2 text-sm text-muted-foreground">{r.body}</p> : null}

              {(r.customer_name || r.country) ? (
                <div className="mt-3 text-xs text-muted-foreground">
                  {r.customer_name ? <span className="font-medium text-foreground">{r.customer_name}</span> : null}
                  {r.customer_name && r.country ? <span className="mx-1">•</span> : null}
                  {r.country ? <span>{r.country}</span> : null}
                </div>
              ) : null}

              {r.products?.slug ? (
                <div className="mt-3">
                  <Link
                    to={productPath(r.products.slug)}
                    className="text-sm font-medium text-emerald-700 hover:underline"
                  >
                    View product →
                  </Link>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}