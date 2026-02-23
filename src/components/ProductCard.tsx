/**
 * Catalog product card used in the grid listing.
 */
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/integrations/supabase/types";
import { unescapeNewlines } from "@/utils/text";
import {
  getLocalizedPath,
  normalizeSupportedLang,
} from "@/utils/getLocalizedPath";
import { getProductImageUrl } from "@/utils/storage";

interface ProductCardProps {
  product: Tables<"products">;
}

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
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
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
  // First apply project helper (if it handles real newlines etc)
  const t = unescapeNewlines(raw);
  // Then ensure escaped "\n" sequences become actual line breaks
  return t.replace(/\\n/g, "\n");
}

export function ProductCard({ product }: ProductCardProps) {
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = normalizeSupportedLang(langParam);

  const title = (product as any).title ?? (product as any).name ?? "Product";
  const imageUrl = getProductImageUrl(product.images?.[0]);
  const category = product.category || "OTHER";
  const description = normalizeDescription(product.description);

  const to = getLocalizedPath("product", lang, { slug: product.slug });

  return (
    <Link to={to}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-[4/5] overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <CardContent className="p-4">
          <div className="mb-2">
            <Badge
              variant="secondary"
              className={categoryColors[category] ?? categoryColors.OTHER}
            >
              {category}
            </Badge>
          </div>

          <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">
            {title}
          </h3>

          <p className="whitespace-pre-line text-muted-foreground text-sm line-clamp-4">
            {description}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          {product.price_cents > 0 ? (
            <span className="text-base font-bold text-primary">
              {formatPrice(product.price_cents, product.currency, lang)}
            </span>
          ) : (
            <span className="text-sm font-semibold text-muted-foreground">
              Coming soon
            </span>
          )}

          {product.inventory <= 5 && product.inventory > 0 && (
            <span className="text-xs text-orange-600 dark:text-orange-400">
              Only {product.inventory} left
            </span>
          )}

          {product.inventory === 0 && (
            <span className="text-xs text-destructive">Out of stock</span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
