/**
 * Category filter pills for narrowing the product list.
 * COFFEE has been removed from the UI.
 */
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const categories = [
  "ALL",
  "TEA",
  "TEA_BAGS",
  "BALM",
  "OIL",
  "SUPERFOOD",
  "OTHERS",
] as const;

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;

  /**
   * Optional override labels (recommended for pages to control wording).
   * Keys: ALL, TEA, TEA_BAGS, BALM, OIL, SUPERFOOD, OTHERS
   */
  labels?: Partial<Record<(typeof categories)[number], string>>;
}

const defaultEnglishLabels: Record<(typeof categories)[number], string> = {
  ALL: "All Products",
  TEA: "Tea",
  TEA_BAGS: "Tea Bags",
  BALM: "Balm",
  OIL: "Oils",
  SUPERFOOD: "Superfoods",
  OTHERS: "Others",
};

export function CategoryFilter({
  selected,
  onSelect,
  labels,
}: CategoryFilterProps) {
  const { t } = useTranslation(["catalog"]);

  const labelFor = (category: (typeof categories)[number]) => {
    const fromProps = labels?.[category];
    if (fromProps) return fromProps;

    const key =
      category === "ALL"
        ? "catalog:categories.all"
        : category === "TEA"
          ? "catalog:categories.tea"
          : category === "TEA_BAGS"
            ? "catalog:categories.tea_bags"
            : category === "BALM"
              ? "catalog:categories.balm"
              : category === "OIL"
                ? "catalog:categories.oil"
                : category === "SUPERFOOD"
                  ? "catalog:categories.superfood"
                  : "catalog:categories.others";

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
