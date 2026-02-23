/**
 * Slide-over cart drawer with item list, totals, and checkout action.
 * Includes promo display + "Bundle applied" badge + "Save X" pill.
 */
import { Link, useParams } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
  const locale = localeMap[lang] ?? "sv-SE";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
};

export function CartDrawer() {
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

  const teaHoneyPromo = appliedPromotions?.find((p) => p.code === "TEA_HONEY_10");
  const showBundle = discountTotal > 0 && !!teaHoneyPromo;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
            {showBundle ? (
              <span className="ml-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
                Bundle applied
              </span>
            ) : null}
          </SheetTitle>

          {showBundle ? (
            <div className="text-xs text-muted-foreground mt-1">
              {teaHoneyPromo?.label ?? "Tea + Honey Bundle (10% off honey)"}
            </div>
          ) : null}
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground">Add some products to get started</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => {
                const img = getProductImageUrl(item.product.images?.[0]);

                return (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <img
                        src={img}
                        alt={item.product.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.product.title}</h4>

                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.product.price_cents, item.product.currency, lang)}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="w-8 text-center text-sm">{item.quantity}</span>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.inventory}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4 space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  {formatPrice(subtotalPrice, currency, lang)}
                </span>
              </div>

              {/* Promotions + Save pill */}
              {discountTotal > 0 ? (
                <div className="space-y-2">
                  {appliedPromotions.map((p) => (
                    <div key={p.code} className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        {p.label}
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
                          Save {formatPrice(p.discount_cents, currency, lang)}
                        </span>
                      </span>

                      <span className="font-medium">
                        -{formatPrice(p.discount_cents, currency, lang)}
                      </span>
                    </div>
                  ))}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discounts</span>
                    <span className="font-medium">
                      -{formatPrice(discountTotal, currency, lang)}
                    </span>
                  </div>
                </div>
              ) : null}

              <Separator />

              {/* Total */}
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(totalPrice, currency, lang)}</span>
              </div>

              <Button asChild className="w-full" size="lg">
                <Link to={checkoutPath} onClick={closeCart}>
                  Proceed to Checkout
                </Link>
              </Button>

              <Button variant="outline" className="w-full" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
