/**
 * Category filter pills for narrowing the product list.
 * COFFEE has been removed from the UI.
 */
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const categories = ["ALL", "TEA", "OIL", "SUPERFOOD", "OTHER"] as const;

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;

  /**
   * Optional override labels (recommended for pages to control wording).
   * Keys: ALL, TEA, OIL, SUPERFOOD, OTHER
   */
  labels?: Partial<Record<(typeof categories)[number], string>>;
}

const defaultEnglishLabels: Record<(typeof categories)[number], string> = {
  ALL: "All Products",
  TEA: "Tea",
  OIL: "Oils",
  SUPERFOOD: "Superfoods",
  OTHER: "Other",
};

export function CategoryFilter({
  selected,
  onSelect,
  labels,
}: CategoryFilterProps) {
  const { t } = useTranslation(["catalog"]);

  const labelFor = (category: (typeof categories)[number]) => {
    // 1) explicit override from props
    const fromProps = labels?.[category];
    if (fromProps) return fromProps;

    // 2) i18n from catalog namespace
    const key =
      category === "ALL"
        ? "catalog:categories.all"
        : category === "TEA"
          ? "catalog:categories.tea"
          : category === "OIL"
            ? "catalog:categories.oils"
            : category === "SUPERFOOD"
              ? "catalog:categories.superfoods"
              : "catalog:categories.other";

    return t(key, { defaultValue: defaultEnglishLabels[category] });
  };

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
          {labelFor(category)}
        </Button>
      ))}
    </div>
  );
}
