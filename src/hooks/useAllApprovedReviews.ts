import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAllApprovedReviews() {
  return useQuery({
    queryKey: ["all-approved-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          title,
          body,
          created_at,
          customer_name,
          country,
          products ( title, slug )
        `)
        .eq("status", "APPROVED")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}