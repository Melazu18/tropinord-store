/**
 * Cart context and reducer-style helpers for cart state management.
 * ✅ Persists cart in localStorage (survives OAuth redirect / reload)
 * ✅ Computes Tea + Honey promo (10% off honey) deterministically
 */
import { createContext, useContext, useEffect, useMemo, useState, useCallback, ReactNode } from "react";
import type { Tables } from "@/integrations/supabase/types";

export interface CartItem {
  product: Tables<"products">;
  quantity: number;
}

export type AppliedPromotion = {
  code: string;
  label: string;
  discount_cents: number;
};

interface CartContextType {
  items: CartItem[];
  addItem: (product: Tables<"products">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  totalItems: number;

  // ✅ pricing breakdown
  subtotalPrice: number;
  discountTotal: number;
  totalPrice: number;
  appliedPromotions: AppliedPromotion[];

  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "tropinord_cart_v1";

// ---- Promo rules (edit anytime) ----
const HONEY_SLUGS = new Set(["thick-forest-honey"]);
const TEA_CATEGORY = "TEA";
const TEA_PREFIX = "tea-";
const TEA_HONEY_DISCOUNT_BPS = 1000; // 10% (basis points)

function clampQty(qty: number, inventory: number) {
  if (inventory <= 0) return 0;
  return Math.max(1, Math.min(qty, inventory));
}

function safeParseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    // minimal shape check
    return parsed.filter((x) => x?.product?.id && typeof x.quantity === "number");
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    return safeParseCart(localStorage.getItem(STORAGE_KEY));
  });

  const [isOpen, setIsOpen] = useState(false);

  // ✅ Persist on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // ---- Mutations ----
  const addItem = useCallback((product: Tables<"products">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);

      if (existing) {
        return prev
          .map((item) => {
            if (item.product.id !== product.id) return item;
            const nextQty = clampQty(item.quantity + quantity, product.inventory);
            return { ...item, quantity: nextQty };
          })
          .filter((x) => x.quantity > 0);
      }

      const nextQty = clampQty(quantity, product.inventory);
      if (nextQty <= 0) return prev;
      return [...prev, { product, quantity: nextQty }];
    });

    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setItems((prev) => {
        const existing = prev.find((x) => x.product.id === productId);
        if (!existing) return prev;

        if (quantity <= 0) {
          return prev.filter((x) => x.product.id !== productId);
        }

        const nextQty = clampQty(quantity, existing.product.inventory);
        return prev
          .map((x) => (x.product.id === productId ? { ...x, quantity: nextQty } : x))
          .filter((x) => x.quantity > 0);
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // ---- Derived totals ----
  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const subtotalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price_cents * item.quantity, 0);
  }, [items]);

  const appliedPromotions = useMemo<AppliedPromotion[]>(() => {
    // Tea detection: category TEA or slug starts with tea-
    const hasTea = items.some((i) => i.product.category === TEA_CATEGORY || (i.product.slug ?? "").startsWith(TEA_PREFIX));
    const honeyItems = items.filter((i) => HONEY_SLUGS.has(i.product.slug ?? ""));

    const promos: AppliedPromotion[] = [];

    // ✅ Tea + Honey: 10% off honey line(s)
    if (hasTea && honeyItems.length > 0) {
      const honeyTotal = honeyItems.reduce((sum, i) => sum + i.product.price_cents * i.quantity, 0);
      const discount = Math.floor((honeyTotal * TEA_HONEY_DISCOUNT_BPS) / 10000);

      if (discount > 0) {
        promos.push({
          code: "TEA_HONEY_10",
          label: "Tea + Honey Bundle (10% off honey)",
          discount_cents: discount,
        });
      }
    }

    return promos;
  }, [items]);

  const discountTotal = useMemo(() => {
    return appliedPromotions.reduce((sum, p) => sum + p.discount_cents, 0);
  }, [appliedPromotions]);

  const totalPrice = useMemo(() => {
    return Math.max(0, subtotalPrice - discountTotal);
  }, [subtotalPrice, discountTotal]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,

        totalItems,

        subtotalPrice,
        discountTotal,
        totalPrice,
        appliedPromotions,

        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
