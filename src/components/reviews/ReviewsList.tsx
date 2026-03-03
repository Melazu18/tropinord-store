import { Card, CardContent } from "@/components/ui/card";
import { Stars } from "@/components/reviews/Stars";
import type { Tables } from "@/integrations/supabase/types";

type ReviewRow = Tables<"reviews">;

export function ReviewsList({ reviews }: { reviews: ReviewRow[] }) {
  if (!reviews?.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {reviews.map((r) => {
        // Support both schemas:
        // - new DB: customer_name / country
        // - old types: might not have them (safe access via "as any")
        const customerName = (r as any).customer_name as string | undefined;
        const country = (r as any).country as string | undefined;

        return (
          <Card key={r.id} className="border">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Stars value={Number(r.rating ?? 0)} />
                {r.created_at ? (
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                ) : null}
              </div>

              {customerName || country ? (
                <div className="text-xs text-muted-foreground">
                  {customerName ? (
                    <span className="font-medium text-foreground">
                      {customerName}
                    </span>
                  ) : null}
                  {customerName && country ? (
                    <span className="mx-1">•</span>
                  ) : null}
                  {country ? <span>{country}</span> : null}
                </div>
              ) : null}

              {r.title ? <div className="font-semibold">{r.title}</div> : null}

              {r.body ? (
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {r.body}
                </p>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
