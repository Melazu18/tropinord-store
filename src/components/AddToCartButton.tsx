/**
 * Button component that adds a product to the cart and shows feedback.
 *
 * ✅ i18n: button labels use translations (ns: catalog)
 * ✅ No behavior changes: inventory logic + coming-soon logic + click handling unchanged
 */
import { useMemo, useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import type { Tables } from "@/integrations/supabase/types";

interface AddToCartButtonProps {
  product: Tables<"products">;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  fullWidth?: boolean;

  disabled?: boolean;
  disabledText?: string; // used only when disabled=true (same as before)
}

export function AddToCartButton({
  product,
  size = "default",
  className,
  fullWidth = false,
  disabled = false,
  disabledText = "Unavailable",
}: AddToCartButtonProps) {
  const { t } = useTranslation(["catalog"]);
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inventory =
    typeof product.inventory === "number" ? product.inventory : null;

  const cartItem = useMemo(
    () => items.find((it) => it.product.id === product.id),
    [items, product.id],
  );

  const isOutOfStock = inventory !== null ? inventory <= 0 : false;
  const isMaxQuantity =
    inventory !== null && cartItem ? cartItem.quantity >= inventory : false;

  const cents = Number(product.price_cents ?? 0);
  const isComingSoon = cents <= 0;

  const isDisabled = disabled || isComingSoon || isOutOfStock || isMaxQuantity;

  const label = useMemo(() => {
    if (isComingSoon)
      return t("catalog:comingSoon", { defaultValue: "Coming soon" });

    if (isOutOfStock)
      return t("catalog:outOfStock", { defaultValue: "Out of stock" });

    if (isMaxQuantity)
      return t("catalog:maxInCart", { defaultValue: "Max in cart" });

    if (justAdded)
      return t("catalog:addedToCart", { defaultValue: "Added" });

    if (disabled) {
      // Keep existing API: if caller passes disabledText, show it
      // (we still provide a translation fallback if they pass the default string)
      if (disabledText === "Unavailable") {
        return t("catalog:unavailable", { defaultValue: "Unavailable" });
      }
      return disabledText;
    }

    return t("catalog:addToCart", { defaultValue: "Add to cart" });
  }, [t, isComingSoon, isOutOfStock, isMaxQuantity, justAdded, disabled, disabledText]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDisabled) return;

    addItem(product);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <Button
      type="button"
      size={size}
      className={[fullWidth ? "w-full" : "", className].filter(Boolean).join(" ")}
      disabled={isDisabled}
      onClick={handleClick}
      aria-disabled={isDisabled}
    >
      {justAdded ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          {label}
        </>
      ) : isComingSoon ? (
        label
      ) : isOutOfStock || isMaxQuantity ? (
        label
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          {label}
        </>
      )}
    </Button>
  );
}