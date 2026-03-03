import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ReviewStats = {
  avg_rating: number;
  review_count: number;
};

export function useApprovedReviewStats() {
  return useQuery({
    queryKey: ["approved-review-stats"],
    queryFn: async (): Promise<ReviewStats> => {
      const { data, error } = await supabase.rpc("get_approved_review_stats");
      if (error) throw error;

      const row = (data as any)?.[0];
      return {
        avg_rating: Number(row?.avg_rating ?? 0),
        review_count: Number(row?.review_count ?? 0),
      };
    },
  });
}
