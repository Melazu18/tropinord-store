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
import { useTranslation } from "react-i18next";

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

  enableSuggestions?: boolean;
  maxSuggestions?: number;
  lang?: string;

  /** Optional override placeholder text */
  placeholder?: string;

  /** Optional override sr-only label for the clear button */
  clearLabel?: string;
}

export function ProductSearch({
  value,
  onChange,
  enableSuggestions = false,
  maxSuggestions = 6,
  lang,
  placeholder,
  clearLabel,
}: ProductSearchProps) {
  const { t } = useTranslation(["catalog", "common"]);
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

  const resolvedPlaceholder =
    placeholder ??
    t("catalog:searchPlaceholder", { defaultValue: "Search products..." });

  const resolvedClearLabel =
    clearLabel ?? t("catalog:clearSearch", { defaultValue: "Clear search" });

  const categoryLabel = (category?: string | null) => {
    const c = (category ?? "").toUpperCase();
    if (!c) return "";
    const key =
      c === "TEA"
        ? "catalog:categories.tea"
        : c === "OIL"
          ? "catalog:categories.oils"
          : c === "SUPERFOOD"
            ? "catalog:categories.superfoods"
            : c === "OTHERS"
              ? "catalog:categories.other"
              : null;

    return key ? t(key, { defaultValue: category ?? "" }) : (category ?? "");
  };

  return (
    <div className="relative w-full max-w-md">
      <Search
        className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
          isFocused ? "text-primary" : "text-muted-foreground"
        }`}
      />

      <Input
        type="text"
        placeholder={resolvedPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
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
          <span className="sr-only">{resolvedClearLabel}</span>
        </Button>
      )}

      {showDropdown && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border bg-background shadow-lg overflow-hidden">
          <ul className="max-h-72 overflow-auto py-1">
            {suggestions.map((p) => {
              const slugOrId = (p.slug && String(p.slug)) || String(p.id);

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
                        {p.category ? categoryLabel(p.category) : p.description}
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
