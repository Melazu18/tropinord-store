/**
 * Category filter pills for narrowing the product list.
 * COFFEE has been removed from the UI.
 */
import { Button } from "@/components/ui/button";

const categories = ["ALL", "TEA", "OIL", "SUPERFOOD", "OTHER"] as const;

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

const categoryLabels: Record<string, string> = {
  ALL: "All Products",
  TEA: "Tea",
  OIL: "Oils",
  SUPERFOOD: "Superfoods",
  OTHER: "Other",
};

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selected === category ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(category)}
          className="transition-all"
        >
          {categoryLabels[category]}
        </Button>
      ))}
    </div>
  );
}
