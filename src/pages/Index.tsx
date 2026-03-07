/**
 * Route page: Catalog (Explore).
 */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Header } from "@/components/Header";
import { PageShell } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { ProductSearch } from "@/components/ProductSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";

const ALLOWED_CATEGORIES = [
  "ALL",
  "TEA",
  "TEA_BAGS",
  "BALM",
  "OIL",
  "SUPERFOOD",
  "OTHERS",
] as const;

const CATEGORY_META: Record<
  Exclude<(typeof ALLOWED_CATEGORIES)[number], "ALL">,
  { labelKey: string; defaultLabel: string; order: number }
> = {
  TEA: {
    labelKey: "catalog:categories.tea",
    defaultLabel: "Tea",
    order: 1,
  },
  TEA_BAGS: {
    labelKey: "catalog:categories.tea_bags",
    defaultLabel: "Tea Bags",
    order: 2,
  },
  BALM: {
    labelKey: "catalog:categories.balm",
    defaultLabel: "Balm",
    order: 3,
  },
  OIL: {
    labelKey: "catalog:categories.oil",
    defaultLabel: "Oil",
    order: 4,
  },
  SUPERFOOD: {
    labelKey: "catalog:categories.superfood",
    defaultLabel: "Superfood",
    order: 5,
  },
  OTHERS: {
    labelKey: "catalog:categories.others",
    defaultLabel: "Others",
    order: 6,
  },
};

function normalizeCategory(category?: string | null) {
  const value = String(category || "ALL")
    .trim()
    .toUpperCase();
  return ALLOWED_CATEGORIES.includes(
    value as (typeof ALLOWED_CATEGORIES)[number],
  )
    ? value
    : "ALL";
}

const Index = () => {
  const { t } = useTranslation(["catalog"]);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = normalizeCategory(searchParams.get("category"));
  const initialQuery = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Fetch all published products once, then filter/group client-side
  const { data: products, isLoading, error } = useProducts("ALL");

  useEffect(() => {
    const next = new URLSearchParams(searchParams);

    if (selectedCategory && selectedCategory !== "ALL") {
      next.set("category", selectedCategory);
    } else {
      next.delete("category");
    }

    if (searchQuery.trim()) next.set("q", searchQuery.trim());
    else next.delete("q");

    const nextStr = next.toString();
    const currStr = searchParams.toString();
    if (nextStr !== currStr) setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchQuery]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let list = [...products];

    if (selectedCategory !== "ALL") {
      list = list.filter(
        (p: any) => normalizeCategory(p.category) === selectedCategory,
      );
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();

    return list.filter((p: any) => {
      const title = String(p.title ?? p.name ?? "").toLowerCase();
      // normalize category and convert underscores to spaces for user-friendly search
      const cat = normalizeCategory(p.category)
        .toLowerCase()
        .replace(/_/g, " ");

      // Match against title and category only, not description
      return title.includes(q) || cat.includes(q);
    });
  }, [products, searchQuery, selectedCategory]);

  const showSectionedCatalog =
    selectedCategory === "ALL" && !searchQuery.trim();

  const groupedProducts = useMemo(() => {
    if (!showSectionedCatalog) return [];

    const groups: Record<string, any[]> = {};

    for (const product of filteredProducts) {
      const category = normalizeCategory(product.category);
      if (category === "ALL") continue;

      if (!groups[category]) groups[category] = [];
      groups[category].push(product);
    }

    return Object.entries(groups)
      .sort(([a], [b]) => {
        const aOrder =
          CATEGORY_META[a as keyof typeof CATEGORY_META]?.order ?? 999;
        const bOrder =
          CATEGORY_META[b as keyof typeof CATEGORY_META]?.order ?? 999;
        return aOrder - bOrder;
      })
      .map(([category, items]) => ({
        category,
        items,
        label: t(
          CATEGORY_META[category as keyof typeof CATEGORY_META]?.labelKey ?? "",
          {
            defaultValue:
              CATEGORY_META[category as keyof typeof CATEGORY_META]
                ?.defaultLabel ?? category,
          },
        ),
      }));
  }, [filteredProducts, showSectionedCatalog, t]);

  return (
    <>
      <Header
        title={t("catalog:title", { defaultValue: "Explore products" })}
        subtitle={t("catalog:subtitle", {
          defaultValue: "Discover our selection of premium products",
        })}
        showLogo={false}
      />

      <main>
        <PageShell>
          <div className="mb-8 space-y-4">
            <ProductSearch value={searchQuery} onChange={setSearchQuery} />

            <h2 className="text-sm font-medium text-muted-foreground">
              {t("catalog:filterByCategory", {
                defaultValue: "Filter by Category",
              })}
            </h2>

            <CategoryFilter
              selected={selectedCategory}
              onSelect={(value) =>
                setSelectedCategory(normalizeCategory(value))
              }
            />
          </div>

          {error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {t("catalog:loadFailed", {
                  defaultValue: "Failed to load products.",
                })}
              </p>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[360px] w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {t("catalog:showingCount", {
                  defaultValue: "Showing {{count}} products",
                  count: filteredProducts.length,
                })}
              </p>

              {filteredProducts.length > 0 ? (
                showSectionedCatalog ? (
                  <div className="space-y-12">
                    {groupedProducts.map((group) => (
                      <section key={group.category} className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                          <h2 className="text-2xl font-semibold">
                            {group.label}
                          </h2>
                          <span className="text-sm text-muted-foreground">
                            {t("catalog:showingCount", {
                              defaultValue: "Showing {{count}} products",
                              count: group.items.length,
                            })}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {group.items.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {t("catalog:noProductsFound", {
                      defaultValue: "No products found.",
                    })}
                  </p>
                </div>
              )}
            </>
          )}
        </PageShell>
      </main>
    </>
  );
};

export default Index;
