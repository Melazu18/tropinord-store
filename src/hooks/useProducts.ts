/**
 * Data hook for fetching the product list with optional category filtering.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type ProductCategory = Tables<"products">["category"];

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("status", "PUBLISHED")
        .order("created_at", { ascending: false });

      if (category && category !== "ALL") {
        query = query.eq("category", category as ProductCategory);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data;
    },
  });
}
