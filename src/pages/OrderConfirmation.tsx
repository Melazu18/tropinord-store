/**
 * Route page: OrderConfirmation.
 * Shows a single order receipt after checkout.
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle, Home, Package } from "lucide-react";
import { Header } from "@/components/Header";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";

interface OrderItem {
  product_id: string;
  title: string;
  quantity: number;
  price_cents: number;
  currency: string;
}

interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

interface OrderAddress {
  street: string;
  city: string;
  postal_code: string;
  country: string;
}

interface Order {
  order_number: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: OrderAddress;
  items: OrderItem[];
  totals: OrderTotals;
  created_at: string;
  payment_method: string;
  currency?: string;
}

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export default function OrderConfirmation() {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order");
  const guestToken = searchParams.get("token"); // ✅ guest token for Swish guest flow

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!orderNumber) {
        setError("Missing order reference.");
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fnError } = await supabase.functions.invoke(
          "get-order-public",
          {
            body: {
              order_number: orderNumber,
              token: guestToken ?? null,
            },
          },
        );

        if (fnError) throw fnError;

        if (!data?.ok) {
          if (!isMounted) return;
          setError(data?.error ?? "Order not found.");
          return;
        }

        const safeOrder = data.order;
        if (!safeOrder) {
          if (!isMounted) return;
          setError("Order not found.");
          return;
        }

        if (!isMounted) return;

        setOrder({
          ...safeOrder,
          address: safeOrder.address as unknown as OrderAddress,
          items: safeOrder.items as unknown as OrderItem[],
          totals: safeOrder.totals as unknown as OrderTotals,
        });

        // ✅ Clear cart once we have a valid order
        clearCart();
      } catch (e) {
        console.error(e);
        if (!isMounted) return;
        setError("Could not load your order details.");
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [orderNumber, guestToken, clearCart]);

  const currency = useMemo(() => {
    return (
      order?.items?.[0]?.currency ??
      (order?.currency ? String(order.currency) : "SEK")
    );
  }, [order]);

  return (
    <>
      <Header title="Order confirmed" subtitle="Receipt and order details." />
      <main>
        <PageShell>
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <Card>
                <CardContent className="p-8 space-y-6">
                  <div className="text-center space-y-3">
                    <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                    <Skeleton className="h-8 w-64 mx-auto" />
                    <Skeleton className="h-4 w-72 mx-auto" />
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <Package className="h-10 w-10 mx-auto text-muted-foreground" />
                  <h2 className="text-xl font-semibold">
                    Unable to load order
                  </h2>
                  <p className="text-muted-foreground">{error}</p>
                  <Button asChild>
                    <Link to="/">Back to catalog</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : order ? (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900 mb-4">
                        <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">
                        Thank you for your order
                      </h2>
                      <p className="text-muted-foreground">
                        Order{" "}
                        <span className="font-mono">{order.order_number}</span>
                      </p>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <h3 className="font-semibold">Customer</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.full_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.email}
                        </p>
                        {order.phone ? (
                          <p className="text-sm text-muted-foreground">
                            {order.phone}
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold">Shipping address</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.address.street}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.address.postal_code} {order.address.city}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.address.country}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <h3 className="font-semibold mb-4">Items</h3>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.product_id}
                          className="flex items-start justify-between gap-4"
                        >
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            {formatMoney(
                              item.price_cents * item.quantity,
                              item.currency,
                            )}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>
                          {formatMoney(order.totals.subtotal, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>
                          {formatMoney(order.totals.shipping, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span>{formatMoney(order.totals.tax, currency)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-base">
                        <span>Total</span>
                        <span>{formatMoney(order.totals.total, currency)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="outline">
                    <Link to="/">
                      <Home className="h-4 w-4 mr-2" />
                      Back to catalog
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/orders">
                      View orders
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </PageShell>
      </main>
    </>
  );
}
