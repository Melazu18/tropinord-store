import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export function useRelatedProducts(category?: string, currentSlug?: string) {
  return useQuery({
    queryKey: ["related-products", category, currentSlug],
    queryFn: async () => {
      if (!category) return [];

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .neq("slug", currentSlug)
        .eq("status", "PUBLISHED")
        .limit(4);

      if (error) throw error;

      return data as Tables<"products">[];
    },
    enabled: !!category,
  });
}
