/**
 * Route page: ProductDetail
 *
 * Safe hooks order + ritual cross-sell for TEA:
 * - Animated “Complete Your Tea Ritual” section (Honey + Reusable Organic Tea Bags)
 * - Auto-add honey after tea is added to cart (once per session, if honey not already in cart)
 * - Bundle message when Tea + Honey are in cart (discount requires CartContext upgrade)
 * - Ritual badges UI
 */
import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { Header } from "@/components/Header";
import { PageShell } from "@/components/PageShell";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/ProductCard";
import { AddToCartButton } from "@/components/AddToCartButton";

import { useCart } from "@/contexts/CartContext";
import { useProduct } from "@/hooks/useProduct";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";

import { supabase } from "@/integrations/supabase/client";
import { unescapeNewlines } from "@/utils/text";
import { getProductImageUrl } from "@/utils/storage";
import { getLocalizedPath, normalizeSupportedLang } from "@/utils/getLocalizedPath";

const localeMap: Record<string, string> = {
  sv: "sv-SE",
  en: "en-US",
  ar: "ar",
  fr: "fr-FR",
  de: "de-DE",
  sw: "sw",
};

const formatPrice = (cents: number, currency: string, lang: string) => {
  const amount = cents / 100;
  const locale = localeMap[lang] ?? "en-US";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
};

const categoryColors: Record<string, string> = {
  TEA: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  OIL: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  SUPERFOOD:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  OTHER: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

function normalizeDescription(raw?: string | null) {
  if (!raw) return "";
  const t = unescapeNewlines(raw);
  return t.replace(/\\n/g, "\n");
}

function isTeaCategory(category?: string | null) {
  return (category ?? "").toUpperCase() === "TEA";
}

export default function ProductDetail() {
  // ✅ All hooks are declared before any conditional returns
  const navigate = useNavigate();
  const { lang: langParam, slug } = useParams<{ lang: string; slug: string }>();
  const lang = normalizeSupportedLang(langParam);

  const cart = useCart();

  const { data: product, isLoading, error } = useProduct(slug || "");

  // Category + slug derived safely even when product is undefined
  const currentSlug = (product as any)?.slug ?? (slug ?? "");
  const rawCategory = (product as any)?.category ?? "OTHER";
  const safeCategory = rawCategory === "COFFEE" ? "OTHER" : rawCategory;
  const isTea = isTeaCategory(safeCategory);

  const explorePath = useMemo(() => getLocalizedPath("explore", lang), [lang]);

  const onBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(explorePath);
  };

  // Related products (same category) – still safe if category undefined
  const { data: relatedProductsRaw } = useRelatedProducts(rawCategory, currentSlug);

  const relatedProducts = useMemo(() => {
    const list = (relatedProductsRaw ?? []) as any[];
    // Never suggest coffee
    return list.filter((p) => (p?.category ?? "") !== "COFFEE");
  }, [relatedProductsRaw]);

  // Ritual cross-sell targets (Tea only)
  const ritualSuggestionSlugs = useMemo(() => {
    return isTea ? ["thick-forest-honey", "organic-reusable-tea-bags"] : [];
  }, [isTea]);

  const { data: ritualSuggestions } = useQuery({
    queryKey: ["ritual-suggestions", ritualSuggestionSlugs.join("|")],
    queryFn: async () => {
      if (ritualSuggestionSlugs.length === 0) return [];

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("slug", ritualSuggestionSlugs)
        .eq("status", "PUBLISHED");

      if (error) throw error;

      // preserve order from ritualSuggestionSlugs
      const map = new Map((data ?? []).map((p: any) => [p.slug, p]));
      return ritualSuggestionSlugs
        .map((s) => map.get(s))
        .filter(Boolean) as any[];
    },
    enabled: ritualSuggestionSlugs.length > 0,
  });

  const honey = useMemo(() => {
    return (ritualSuggestions ?? []).find((p: any) => p.slug === "thick-forest-honey");
  }, [ritualSuggestions]);

  // Cart-derived states (safe even if product undefined)
  const teaInCart = useMemo(() => {
    if (!isTea) return false;
    return cart.items.some((it) => it.product.slug === currentSlug);
  }, [cart.items, currentSlug, isTea]);

  const honeyInCart = useMemo(() => {
    return cart.items.some((it) => it.product.slug === "thick-forest-honey");
  }, [cart.items]);

  const bundleActive = isTea && teaInCart && honeyInCart;

  // Auto-add honey ONCE after tea is added (session + per tea slug)
  const autoAddRanRef = useRef(false);
  useEffect(() => {
    if (!isTea) return;
    if (!currentSlug) return;
    if (!teaInCart) return;
    if (honeyInCart) return;
    if (!honey) return;

    // Only once per mount
    if (autoAddRanRef.current) return;

    // Only once per session per tea slug
    const key = `auto_honey_added_for_${currentSlug}`;
    if (sessionStorage.getItem(key) === "1") return;

    // Must be purchasable
    const honeyPrice = Number((honey as any).price_cents ?? 0);
    const honeyInv = Number((honey as any).inventory ?? 0);
    if (honeyPrice <= 0 || honeyInv <= 0) return;

    autoAddRanRef.current = true;
    sessionStorage.setItem(key, "1");
    cart.addItem(honey as any, 1);
  }, [isTea, currentSlug, teaInCart, honeyInCart, honey, cart]);

  // Ritual badge system
  const ritualBadges = useMemo(() => {
    if (safeCategory === "TEA") return ["Ritual Friendly", "Pairs with Honey", "Slow Brew"];
    if (safeCategory === "OIL") return ["Heritage Use", "Multi-Purpose", "Small Batch"];
    if (safeCategory === "SUPERFOOD") return ["Daily Ritual", "Minimal Processing", "Traditional Ingredient"];
    return [];
  }, [safeCategory]);

  // Render-safe fields
  const title = (product as any)?.title ?? (product as any)?.name ?? "Product";
  const description = normalizeDescription((product as any)?.description ?? "");
  const imageUrl = getProductImageUrl((product as any)?.images?.[0]);

  const cents = Number((product as any)?.price_cents ?? 0);
  const currency = String((product as any)?.currency ?? "SEK");
  const inventory = (product as any)?.inventory ?? null;
  const isComingSoon = cents <= 0;

  // ✅ Now conditional returns (after hooks)
  if (isLoading) {
    return (
      <>
        <Header title="Product details" subtitle="Loading product information." />
        <main>
          <PageShell>
            <Skeleton className="h-6 w-32 mb-8" />
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </PageShell>
        </main>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header title="Product details" subtitle="This product could not be found." />
        <main>
          <PageShell>
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Product not found</h2>
              <p className="text-muted-foreground">
                The product you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>

              <button
                type="button"
                onClick={onBack}
                className="mt-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to catalog
              </button>
            </div>
          </PageShell>
        </main>
      </>
    );
  }

  // ✅ Actual page render
  return (
    <>
      <Header title={title} subtitle="Product details and purchase options." />

      <main>
        <PageShell>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to catalog
          </button>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="w-full max-w-md mx-auto overflow-hidden rounded-xl bg-muted">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-auto object-contain"
                loading="eager"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <Badge
                variant="secondary"
                className={`w-fit mb-3 ${categoryColors[safeCategory] ?? categoryColors.OTHER}`}
              >
                {safeCategory}
              </Badge>

              {/* Ritual badges */}
              {ritualBadges.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-5">
                  {ritualBadges.map((b) => (
                    <span
                      key={b}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              ) : null}

              {/* Description (single render) */}
              <p className="whitespace-pre-line text-muted-foreground text-lg mb-6">
                {description}
              </p>

              {/* Bundle message (visual only; discounts require cart upgrade) */}
              {bundleActive ? (
                <div className="mb-5 rounded-lg border px-4 py-3">
                  <div className="text-sm font-semibold">Tea + Honey Ritual Pairing</div>
                  <div className="text-xs text-muted-foreground">
                    Both items are in your cart. Bundle discounts can be enabled in checkout.
                  </div>
                </div>
              ) : null}

              {/* Price + stock */}
              <div className="flex items-center gap-4 mb-6">
                {isComingSoon ? (
                  <span className="text-2xl font-semibold text-muted-foreground">Coming soon</span>
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(cents, currency, lang)}
                  </span>
                )}

                {!isComingSoon && inventory !== null && inventory !== undefined ? (
                  <span className="text-sm text-muted-foreground">
                    {Number(inventory) > 0 ? `${inventory} in stock` : "Out of stock"}
                  </span>
                ) : null}
              </div>

              {/* Add to cart */}
              <div className="mt-auto">
                <AddToCartButton
                  product={product as any}
                  fullWidth
                  disabled={isComingSoon}
                  disabledText="Coming soon"
                />
              </div>
            </div>
          </div>

          {/* Ritual cross-sell (animated) */}
          {isTea && (ritualSuggestions?.length ?? 0) > 0 ? (
            <motion.section
              className="mt-14"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Complete Your Tea Ritual</h2>
                  <p className="text-muted-foreground">
                    Simple companions that elevate the cup.
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  Ritual Picks
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(ritualSuggestions ?? []).map((p: any) => (
                  <div key={p.id ?? p.slug} className="relative">
                    <div className="absolute z-10 top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-background/90 border backdrop-blur">
                        Ritual Pick
                      </span>
                    </div>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                Tip: Add Wild Forest Honey for a richer ritual cup.
              </div>
            </motion.section>
          ) : null}

          {/* Related products */}
          {relatedProducts.length > 0 ? (
            <section className="mt-14">
              <h2 className="text-xl font-semibold mb-5">You may also like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p: any) => (
                  <ProductCard key={p.id ?? p.slug} product={p} />
                ))}
              </div>
            </section>
          ) : null}
        </PageShell>
      </main>
    </>
  );
}
