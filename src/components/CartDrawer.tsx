/**
 * Slide-over cart drawer with item list, totals, and checkout action.
 * Includes promo display + "Bundle applied" badge + "Save X" pill.
 *
 * ✅ i18n: all UI strings moved to translations (ns: common, cart)
 *
 * ✅ FIX: If user is not authenticated, redirect them to Login with
 * ?redirect=<localized checkout path> instead of sending them to homepage.
 *
 * ✅ UX: Continue shopping goes to Product Catalog (explore)
 * ✅ NEW: If cart contains TEA, show “Includes free tea bags” notice
 */
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getProductImageUrl } from "@/utils/storage";
import {
  getLocalizedPath,
  normalizeSupportedLang,
} from "@/utils/getLocalizedPath";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

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
  const locale = localeMap[lang] ?? "sv-SE";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    amount,
  );
};

export function CartDrawer() {
  const { t } = useTranslation(["common", "cart"]);
  const navigate = useNavigate();

  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotalPrice,
    discountTotal,
    totalPrice,
    appliedPromotions,
    clearCart,
  } = useCart();

  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = normalizeSupportedLang(langParam);

  const currency = items[0]?.product.currency || "SEK";
  const checkoutPath = getLocalizedPath("checkout", lang);
  const explorePath = getLocalizedPath("explore", lang);

  // Login page uses ?redirect=...
  const loginPath =
    (() => {
      try {
        return getLocalizedPath("login", lang);
      } catch {
        return `/${lang}/login`;
      }
    })() + `?redirect=${encodeURIComponent(checkoutPath)}`;

  const teaHoneyPromo = appliedPromotions?.find(
    (p) => p.code === "TEA_HONEY_10",
  );
  const showBundle = discountTotal > 0 && !!teaHoneyPromo;

  const hasTeaInCart = items.some(
    (it) => String(it.product.category ?? "").toUpperCase() === "TEA",
  );

  const handleProceedToCheckout = async () => {
    closeCart();

    const { data } = await supabase.auth.getSession();
    if (data.session) {
      navigate(checkoutPath);
      return;
    }

    navigate(loginPath);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t("cart:title", { defaultValue: "Shopping Cart" })}
            {showBundle ? (
              <span className="ml-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
                {t("cart:bundleApplied", { defaultValue: "Bundle applied" })}
              </span>
            ) : null}
          </SheetTitle>

          {showBundle ? (
            <div className="text-xs text-muted-foreground mt-1">
              {teaHoneyPromo?.label ??
                t("cart:teaHoneyLabel", {
                  defaultValue: "Tea + Honey Bundle (10% off honey)",
                })}
            </div>
          ) : null}
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-1">
              {t("cart:emptyTitle", { defaultValue: "Your cart is empty" })}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("cart:emptyBody", {
                defaultValue: "Add some products to get started",
              })}
            </p>
            <Button asChild className="mt-6">
              <Link to={explorePath} onClick={closeCart}>
                {t("cart:continueShopping", { defaultValue: "Continue Shopping" })}
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => {
                const img = getProductImageUrl(item.product.images?.[0]);
                const title =
                  (item.product as any).title ??
                  (item.product as any).name ??
                  t("cart:productFallbackTitle", { defaultValue: "Product" });

                return (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <img
                        src={img}
                        alt={title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{title}</h4>

                      <p className="text-sm text-muted-foreground">
                        {formatPrice(
                          item.product.price_cents,
                          item.product.currency,
                          lang,
                        )}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          aria-label={t("cart:decreaseQty", {
                            defaultValue: "Decrease quantity",
                          })}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.inventory}
                          aria-label={t("cart:increaseQty", {
                            defaultValue: "Increase quantity",
                          })}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.product.id)}
                          aria-label={t("cart:removeItem", {
                            defaultValue: "Remove item",
                          })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasTeaInCart ? (
              <div className="rounded-lg border px-4 py-3 text-sm mb-3">
                <div className="font-semibold">
                  {t("common:includesFreeTeaBagsTitle", {
                    defaultValue: "Includes free tea bags",
                  })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("common:includesFreeTeaBagsBody", {
                    defaultValue:
                      "Every tea order includes a pack of 10 reusable organic tea bags.",
                  })}
                </div>
              </div>
            ) : null}

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("cart:subtotal", { defaultValue: "Subtotal" })}
                </span>
                <span className="font-medium">
                  {formatPrice(subtotalPrice, currency, lang)}
                </span>
              </div>

              {discountTotal > 0 ? (
                <div className="space-y-2">
                  {appliedPromotions.map((p) => (
                    <div key={p.code} className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        {p.label}
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
                          {t("cart:save", { defaultValue: "Save" })}{" "}
                          {formatPrice(p.discount_cents, currency, lang)}
                        </span>
                      </span>

                      <span className="font-medium">
                        -{formatPrice(p.discount_cents, currency, lang)}
                      </span>
                    </div>
                  ))}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("cart:discounts", { defaultValue: "Discounts" })}
                    </span>
                    <span className="font-medium">
                      -{formatPrice(discountTotal, currency, lang)}
                    </span>
                  </div>
                </div>
              ) : null}

              <Separator />

              <div className="flex justify-between text-base font-semibold">
                <span>{t("cart:total", { defaultValue: "Total" })}</span>
                <span>{formatPrice(totalPrice, currency, lang)}</span>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleProceedToCheckout}
              >
                {t("cart:proceedToCheckout", {
                  defaultValue: "Proceed to Checkout",
                })}
              </Button>

              <Button variant="outline" className="w-full" onClick={clearCart}>
                {t("cart:clearCart", { defaultValue: "Clear Cart" })}
              </Button>

              <Button asChild variant="ghost" className="w-full">
                <Link to={explorePath} onClick={closeCart}>
                  {t("cart:continueShopping", {
                    defaultValue: "Continue shopping",
                  })}
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}