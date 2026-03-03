// src/components/reviews/ReviewSummary.tsx
import { Stars } from "@/components/reviews/Stars";

export function computeAverage(ratings: number[]) {
  if (!Array.isArray(ratings) || ratings.length === 0) return 0;
  const sum = ratings.reduce((a, b) => a + b, 0);
  return sum / ratings.length;
}

type ReviewSummaryProps =
  | {
      // ✅ Original mode (keeps existing behavior)
      ratings: number[];
      count: number;
      compact?: boolean;
      avg?: never;
    }
  | {
      // ✅ New mode (global stats)
      avg: number;
      count: number;
      compact?: boolean;
      ratings?: never;
    };

export function ReviewSummary(props: ReviewSummaryProps) {
  const { count, compact = false } = props;

  if (!count || count === 0) return null;

  const avg =
    "avg" in props ? Number(props.avg ?? 0) : computeAverage(props.ratings);

  const display = avg ? avg.toFixed(1) : "0.0";

  return (
    <div className={`flex items-center gap-2 ${compact ? "text-sm" : ""}`}>
      <span className="font-semibold">{display}</span>
      <Stars value={avg} />
      <span className="text-muted-foreground">({count})</span>
    </div>
  );
}