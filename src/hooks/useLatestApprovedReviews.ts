import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ReviewRow = Tables<"reviews">;

export function useLatestApprovedReviews(limit = 6) {
  return useQuery({
    queryKey: ["latest-approved-reviews", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("status", "APPROVED")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data ?? []) as ReviewRow[];
    },
  });
}