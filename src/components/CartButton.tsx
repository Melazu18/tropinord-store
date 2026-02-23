/**
 * Header/cart icon button that opens the cart drawer.
 */
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";

export function CartButton() {
  const { totalItems, openCart } = useCart();

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={openCart}
      aria-label="Open cart"
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Button>
  );
}
