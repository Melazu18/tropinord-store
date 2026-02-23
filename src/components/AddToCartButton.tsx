/**
 * Button component that adds a product to the cart and shows feedback.
 */
import { useMemo, useState } from "react";
import { ShoppingCart, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import type { Tables } from "@/integrations/supabase/types";

interface AddToCartButtonProps {
  product: Tables<"products">;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  fullWidth?: boolean;

  disabled?: boolean;
  disabledText?: string;
}

export function AddToCartButton({
  product,
  size = "default",
  className,
  fullWidth = false,
  disabled = false,
  disabledText = "Unavailable",
}: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inventory = typeof product.inventory === "number" ? product.inventory : null;

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
    if (isComingSoon) return "Coming soon";
    if (isOutOfStock) return "Out of stock";
    if (isMaxQuantity) return "Max in cart";
    if (justAdded) return "Added";
    return "Add to cart";
  }, [isComingSoon, isOutOfStock, isMaxQuantity, justAdded]);

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
