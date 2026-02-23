/**
 * Data hook for fetching a single product by slug/id.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("status", "PUBLISHED")
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!slug,
  });
}
