/**
 * Route page: AdminOrders.
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { PageShell } from "@/components/PageShell";
import {
  ArrowLeft,
  Search,
  Filter,
  RefreshCw,
  Package,
  Mail,
  Phone,
  MapPin,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import { supabase } from "@/integrations/supabase/client";
import type { Tables, Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type Order = Tables<"orders">;
type PaymentStatus = Database["public"]["Enums"]["payment_status"];
type PaymentMethod = Database["public"]["Enums"]["payment_method"];
type PaymentProvider = Database["public"]["Enums"]["payment_provider"];

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

type ProviderMetadata = {
  swish_number?: string;
  swish_reference?: string;
  swish_qr_payload?: string;
  swish_amount_cents?: number;
  swish_currency?: string;
};

export default function AdminOrders() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [markingPaidOrderId, setMarkingPaidOrderId] = useState<string | null>(null);

  const statuses: PaymentStatus[] = useMemo(
    () => ["CREATED", "AWAITING_PAYMENT", "PAID", "FAILED", "CANCELLED", "REFUNDED"],
    [],
  );

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;

      if (!user) {
        navigate("/");
        return;
      }

      const { data: roles, error: roleErr } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleErr || !roles) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view this page.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
    };

    void checkAdminAccess();
  }, [navigate, toast]);

  const fetchOrders = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders.",
        variant: "destructive",
      });
    } else {
      setOrders(data || []);
      setFilteredOrders(data || []);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (isAdmin) void fetchOrders();
  }, [isAdmin]);

  useEffect(() => {
    let result = [...orders];

    if (statusFilter !== "ALL") {
      result = result.filter((order) => order.payment_status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((order) => {
        const orderNumber = (order.order_number || "").toLowerCase();
        const email = (order.email || "").toLowerCase();
        const fullName = (order.full_name || "").toLowerCase();
        return orderNumber.includes(q) || email.includes(q) || fullName.includes(q);
      });
    }

    setFilteredOrders(result);
  }, [orders, statusFilter, searchQuery]);

  const formatPrice = (cents: number, currency = "SEK") => {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency,
    }).format((cents || 0) / 100);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeVariant = (
    status: string,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "PAID":
        return "default";
      case "CANCELLED":
      case "FAILED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: PaymentStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Success", description: "Order status updated." });
    void fetchOrders();
  };

  const isOrderSwish = (order: Order) => {
    const method = order.payment_method as PaymentMethod | null;
    const provider = order.payment_provider as PaymentProvider | null;
    return method === "SWISH" || provider === "SWISH";
  };

  const verifySwishPayment = async (order: Order) => {
    try {
      setMarkingPaidOrderId(order.id);

      const { error } = await supabase.functions.invoke("admin-swish-mark-paid", {
        body: { order_id: order.id },
      });

      if (error) {
        console.error("admin-swish-mark-paid error:", error);
        toast({
          title: "Verification failed",
          description: "Could not mark Swish payment as paid.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Marked as paid",
        description: "Swish payment verified and order updated.",
      });

      await fetchOrders();
    } finally {
      setMarkingPaidOrderId(null);
    }
  };

  if (!isAdmin) {
    return (
      <>
        <Header title="Admin orders" subtitle="Administrator access required." />
        <main>
          <PageShell className="py-16">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                You do not have permission to view this page.
              </p>
              <Button asChild>
                <Link to="/">Back to catalog</Link>
              </Button>
            </div>
          </PageShell>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Admin orders" subtitle="Manage orders, search, and update statuses." />
      <main>
        <PageShell>
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to shop
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold">Order Management</h1>
            <Button onClick={() => void fetchOrders()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order number, email, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">
                  {orders.filter((o) => o.payment_status === "PAID").length}
                </div>
                <p className="text-xs text-muted-foreground">Paid</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-accent-foreground">
                  {orders.filter((o) => o.payment_status === "AWAITING_PAYMENT" || o.payment_status === "CREATED").length}
                </div>
                <p className="text-xs text-muted-foreground">Pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {formatPrice(
                    orders
                      .filter((o) => o.payment_status === "PAID")
                      .reduce((sum, o) => sum + (((o.totals as unknown as OrderTotals)?.total ?? 0) as number), 0),
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "ALL"
                  ? "Try adjusting your filters."
                  : "No orders have been placed yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const items = (order.items as unknown as OrderItem[]) ?? [];
                const totals = (order.totals as unknown as OrderTotals) ?? {
                  subtotal: 0,
                  shipping: 0,
                  tax: 0,
                  total: 0,
                };
                const address = (order.address as unknown as OrderAddress) ?? {
                  street: "",
                  city: "",
                  postal_code: "",
                  country: "",
                };

                const swish = isOrderSwish(order);
                const canVerifySwish = swish && order.payment_status !== "PAID";

                const meta = (order.provider_metadata as unknown as ProviderMetadata) ?? {};
                const swishNumber = meta.swish_number ?? "1230558973";
                const swishRef = meta.swish_reference;

                return (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <CardTitle className="text-lg">{order.order_number}</CardTitle>
                          <Badge variant={getStatusBadgeVariant(order.payment_status)}>
                            {order.payment_status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            via {order.payment_method} / {order.payment_provider}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <Select
                            value={order.payment_status}
                            onValueChange={(value) =>
                              void updateOrderStatus(order.id, value as PaymentStatus)
                            }
                          >
                            <SelectTrigger className="w-44">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {canVerifySwish ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              disabled={markingPaidOrderId === order.id}
                              onClick={() => void verifySwishPayment(order)}
                            >
                              <BadgeCheck className="h-4 w-4" />
                              {markingPaidOrderId === order.id ? "Verifying…" : "Verify Swish"}
                            </Button>
                          ) : null}

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                View Details
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Order {order.order_number}</DialogTitle>
                                <DialogDescription>
                                  View customer details, shipping address, items, totals, and timestamps.
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6">
                                {/* Customer Info */}
                                <div>
                                  <h4 className="font-semibold mb-2">Customer</h4>
                                  <div className="space-y-1 text-sm">
                                    <p className="font-medium">{order.full_name}</p>
                                    <p className="flex items-center gap-2">
                                      <Mail className="h-3 w-3" />
                                      {order.email}
                                    </p>
                                    {order.phone ? (
                                      <p className="flex items-center gap-2">
                                        <Phone className="h-3 w-3" />
                                        {order.phone}
                                      </p>
                                    ) : null}
                                  </div>
                                </div>

                                {/* Payment meta */}
                                <div>
                                  <h4 className="font-semibold mb-2">Payment</h4>
                                  <div className="text-sm space-y-1">
                                    <p>
                                      <span className="text-muted-foreground">Method:</span>{" "}
                                      {order.payment_method}
                                    </p>
                                    <p>
                                      <span className="text-muted-foreground">Provider:</span>{" "}
                                      {order.payment_provider}
                                    </p>

                                    {swish ? (
                                      <>
                                        <p className="break-all">
                                          <span className="text-muted-foreground">Swish number:</span>{" "}
                                          {swishNumber}
                                        </p>
                                        {swishRef ? (
                                          <p className="break-all">
                                            <span className="text-muted-foreground">Reference:</span>{" "}
                                            {swishRef}
                                          </p>
                                        ) : null}
                                      </>
                                    ) : null}

                                    {order.provider_session_id ? (
                                      <p className="break-all">
                                        <span className="text-muted-foreground">Session ID:</span>{" "}
                                        {order.provider_session_id}
                                      </p>
                                    ) : null}
                                  </div>
                                </div>

                                {/* Address */}
                                <div>
                                  <h4 className="font-semibold mb-2">Shipping Address</h4>
                                  <div className="text-sm flex items-start gap-2">
                                    <MapPin className="h-3 w-3 mt-1" />
                                    <div>
                                      <p>{address.street}</p>
                                      <p>
                                        {address.postal_code} {address.city}
                                      </p>
                                      <p>{address.country}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Items */}
                                <div>
                                  <h4 className="font-semibold mb-2">Items</h4>
                                  <div className="space-y-2">
                                    {items.map((item, idx) => (
                                      <div key={idx} className="flex justify-between text-sm">
                                        <span>
                                          {item.title} × {item.quantity}
                                        </span>
                                        <span>{formatPrice(item.price_cents * item.quantity, item.currency)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Totals */}
                                <div className="border-t pt-4 space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatPrice(totals.subtotal, order.currency)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{formatPrice(totals.shipping, order.currency)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>{formatPrice(totals.tax, order.currency)}</span>
                                  </div>
                                  <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>{formatPrice(totals.total, order.currency)}</span>
                                  </div>
                                </div>

                                {/* Timestamps */}
                                <div className="text-xs text-muted-foreground space-y-1">
                                  <p>Created: {formatDate(order.created_at)}</p>
                                  <p>Paid: {formatDate(order.paid_at)}</p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="grid sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Customer:</span>{" "}
                          <span className="font-medium">{order.full_name}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Date:</span>{" "}
                          {formatDate(order.created_at)}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total:</span>{" "}
                          <span className="font-semibold">
                            {formatPrice(totals.total, order.currency)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </PageShell>
      </main>
    </>
  );
}