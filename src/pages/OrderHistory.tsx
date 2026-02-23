/**
 * Route page: OrderHistory.
 */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
 
 type Order = Tables<"orders">;
 
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
 
 export default function OrderHistory() {
   const navigate = useNavigate();
   const [orders, setOrders] = useState<Order[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [user, setUser] = useState<{ id: string } | null>(null);
 
   useEffect(() => {
     const checkAuth = async () => {
       const { data: { user } } = await supabase.auth.getUser();
       if (!user) {
         navigate("/");
         return;
       }
       setUser(user);
     };
     checkAuth();
   }, [navigate]);
 
   useEffect(() => {
     const fetchOrders = async () => {
       if (!user) return;
       
       const { data, error } = await supabase
         .from("orders")
         .select("*")
         .order("created_at", { ascending: false });
 
       if (error) {
         console.error("Error fetching orders:", error);
       } else {
         setOrders(data || []);
       }
       setIsLoading(false);
     };
 
     if (user) {
       fetchOrders();
     }
   }, [user]);
 
   const formatPrice = (cents: number, currency = "SEK") => {
     return new Intl.NumberFormat("sv-SE", {
       style: "currency",
       currency,
     }).format(cents / 100);
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
 
   const getStatusIcon = (status: string) => {
     switch (status) {
       case "PAID":
         return <CheckCircle className="h-4 w-4 text-primary" />;
       case "CANCELLED":
       case "FAILED":
         return <XCircle className="h-4 w-4 text-destructive" />;
       case "AWAITING_PAYMENT":
       case "CREATED":
         return <Clock className="h-4 w-4 text-accent-foreground" />;
       default:
         return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
     }
   };
 
   const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
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
 
   if (isLoading) {
     return (
    <>
      <Header title="Orders" subtitle="View recent orders and their status." />
      <main>
        <PageShell>
           <Skeleton className="h-8 w-48 mb-8" />
           <div className="space-y-4">
             {Array.from({ length: 3 }).map((_, i) => (
               <Skeleton key={i} className="h-32 w-full" />
             ))}
           </div>
        </PageShell>
      </main>
    </>
  );
   }
 
   return (
    <>
      <Header title="Orders" subtitle="View recent orders and their status." />
      <main>
        <PageShell>
         <Link
           to="/"
           className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
         >
           <ArrowLeft className="h-4 w-4 mr-2" />
           Back to shop
         </Link>
 
         {orders.length === 0 ? (
           <div className="text-center py-16">
             <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
             <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
             <p className="text-muted-foreground mb-6">
               You haven't placed any orders yet.
             </p>
             <Button asChild>
               <Link to="/">Start Shopping</Link>
             </Button>
           </div>
         ) : (
           <div className="space-y-4">
             {orders.map((order) => {
               const items = order.items as unknown as OrderItem[];
               const totals = order.totals as unknown as OrderTotals;
               
               return (
                 <Card key={order.id}>
                   <CardHeader className="pb-3">
                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                       <div className="flex items-center gap-3">
                         <CardTitle className="text-lg">{order.order_number}</CardTitle>
                         <Badge variant={getStatusBadgeVariant(order.payment_status)}>
                           <span className="flex items-center gap-1">
                             {getStatusIcon(order.payment_status)}
                             {order.payment_status}
                           </span>
                         </Badge>
                       </div>
                       <span className="text-sm text-muted-foreground">
                         {formatDate(order.created_at)}
                       </span>
                     </div>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-3">
                       {items.map((item, idx) => (
                         <div key={idx} className="flex justify-between text-sm">
                           <span>
                             {item.title} × {item.quantity}
                           </span>
                           <span className="font-medium">
                             {formatPrice(item.price_cents * item.quantity, item.currency)}
                           </span>
                         </div>
                       ))}
                       <div className="border-t pt-3 flex justify-between font-semibold">
                         <span>Total</span>
                         <span>{formatPrice(totals.total, order.currency)}</span>
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