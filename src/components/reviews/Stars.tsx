import { Star } from "lucide-react";

export function Stars({
  value,
  outOf = 5,
  size = 16,
}: {
  value: number;
  outOf?: number;
  size?: number;
}) {
  const clamped = Math.max(0, Math.min(outOf, value));

  // Fill stars by rounding to nearest half-star visually as full/empty (simple + clean)
  const filled = Math.round(clamped);

  return (
    <span className="inline-flex items-center gap-1" aria-label={`${value} out of ${outOf} stars`}>
      {Array.from({ length: outOf }).map((_, i) => {
        const isFilled = i < filled;
        return (
          <Star
            key={i}
            className={`h-[${size}px] w-[${size}px] ${
              isFilled ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            }`}
            style={{ height: size, width: size }}
          />
        );
      })}
    </span>
  );
}