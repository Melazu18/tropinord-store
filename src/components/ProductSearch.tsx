/**
 * Search input used to filter products by title/description.
 * Optional: enableSuggestions to show clickable product results.
 */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";

type SuggestProduct = {
  id: string | number;
  title: string;
  slug?: string | null;
  category?: string | null;
  description?: string | null;
};

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;

  /**
   * If true, shows a small dropdown of matching products.
   * Clicking one navigates to /product/:slug (or /product/:id fallback).
   */
  enableSuggestions?: boolean;

  /**
   * Limits the number of suggestions shown.
   */
  maxSuggestions?: number;

  /**
   * Optional: if you use localized routes like /:lang/product/:slug
   * pass "en" | "sv" | "ar" | "fr" | "de" | "sw" etc.
   */
  lang?: string;
}

export function ProductSearch({
  value,
  onChange,
  enableSuggestions = false,
  maxSuggestions = 6,
  lang,
}: ProductSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  // Only fetch when suggestions are enabled
  const { data: allProducts } = useProducts(enableSuggestions ? "ALL" : "ALL");

  const suggestions = useMemo(() => {
    if (!enableSuggestions) return [];
    const q = value.trim().toLowerCase();
    if (q.length < 2) return [];

    const list = (allProducts || []) as SuggestProduct[];

    return list
      .filter((p) => {
        const title = (p.title || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();
        return title.includes(q) || desc.includes(q) || cat.includes(q);
      })
      .slice(0, maxSuggestions);
  }, [allProducts, enableSuggestions, maxSuggestions, value]);

  const showDropdown = enableSuggestions && isFocused && suggestions.length > 0;

  return (
    <div className="relative w-full max-w-md">
      <Search
        className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
          isFocused ? "text-primary" : "text-muted-foreground"
        }`}
      />

      <Input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          // tiny delay so click on dropdown works
          window.setTimeout(() => setIsFocused(false), 120);
        }}
        className="pl-10 pr-10"
      />

      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}

      {showDropdown && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border bg-background shadow-lg overflow-hidden">
          <ul className="max-h-72 overflow-auto py-1">
            {suggestions.map((p) => {
              const slugOrId = (p.slug && String(p.slug)) || String(p.id);

              // supports both:
              //  - /product/:slug
              //  - /:lang/product/:slug (if lang is provided)
              const to = lang
                ? `/${lang}/product/${encodeURIComponent(slugOrId)}`
                : `/product/${encodeURIComponent(slugOrId)}`;

              return (
                <li key={p.id}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-muted transition flex flex-col"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => navigate(to)}
                  >
                    <span className="text-sm font-medium">{p.title}</span>

                    {(p.category || p.description) && (
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {p.category ? p.category : p.description}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
