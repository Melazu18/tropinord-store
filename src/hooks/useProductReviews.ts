import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ReviewRow = Tables<"reviews">;

export function useProductReviews(productId?: string, limit = 6) {
  return useQuery({
    queryKey: ["product-reviews", productId, limit],
    queryFn: async () => {
      if (!productId) return { reviews: [] as ReviewRow[], totalCount: 0 };

      const { data, error, count } = await supabase
        .from("reviews")
        .select("*", { count: "exact" })
        .eq("product_id", productId)
        .eq("status", "APPROVED")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        reviews: (data ?? []) as ReviewRow[],
        totalCount: count ?? 0,
      };
    },
    enabled: Boolean(productId),
  });
}