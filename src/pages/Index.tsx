/**
 * Route page: Catalog (Explore).
 */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Header } from "@/components/Header";
import { PageShell } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { ProductSearch } from "@/components/ProductSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial state from URL
  const initialCategory = (searchParams.get("category") || "ALL").toUpperCase();
  const initialQuery = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const { data: products, isLoading, error } = useProducts(selectedCategory);

  // Keep URL in sync with state (no reload)
  useEffect(() => {
    const next = new URLSearchParams(searchParams);

    if (selectedCategory && selectedCategory !== "ALL") {
      next.set("category", selectedCategory);
    } else {
      next.delete("category");
    }

    if (searchQuery.trim()) next.set("q", searchQuery.trim());
    else next.delete("q");

    // Only update if changed (prevents loops)
    const nextStr = next.toString();
    const currStr = searchParams.toString();
    if (nextStr !== currStr) setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchQuery]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchQuery.trim()) return products;

    const q = searchQuery.toLowerCase();

    return products.filter((p: any) => {
      const title = String(p.title ?? p.name ?? "").toLowerCase();
      const desc = String(p.description ?? "").toLowerCase();
      const cat = String(p.category ?? "").toLowerCase();

      return title.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }, [products, searchQuery]);

  return (
    <>
      <Header
        title="Explore products"
        subtitle="Discover our selection of premium products"
        showLogo={false}
      />

      <main>
        <PageShell>
          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <ProductSearch value={searchQuery} onChange={setSearchQuery} />

            <h2 className="text-sm font-medium text-muted-foreground">
              Filter by Category
            </h2>
            <CategoryFilter
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          {error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Failed to load products.</p>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-[360px] w-full rounded-xl" />
                  ))}
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-6">
                    Showing {filteredProducts.length} products
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </PageShell>
      </main>
    </>
  );
};

export default Index;
