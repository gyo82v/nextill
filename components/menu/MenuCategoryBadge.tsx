import { IconType } from "react-icons";
import { FaUtensils, FaMugSaucer, FaPlateWheat, FaCakeCandles } from "react-icons/fa6";

export type MenuCategory =
  | "food"
  | "drink"
  | "bundle"
  | "dessert"

const categoryConfig: Record<
  MenuCategory,
  {
    icon: IconType;
    bg: string;
    text: string;
    ring: string;
  }
> = {
  food: {
    icon: FaUtensils,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
  },
  drink: {
    icon: FaMugSaucer,
    bg: "bg-sky-50",
    text: "text-sky-700",
    ring: "ring-sky-200",
  },
  dessert: {
    icon: FaCakeCandles,
    bg: "bg-pink-50",
    text: "text-pink-700",
    ring: "ring-pink-200",
  },
  bundle: {
    icon: FaPlateWheat,
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
  }
};

type MenuCategoryBadgeProps = {
  category: string;
  className?: string;
  size?: number;
};

export function MenuCategoryBadge({
  category,
  className = "",
  size = 16,
}: MenuCategoryBadgeProps) {
  const config = categoryConfig[category as MenuCategory];
  const Icon = config.icon;

  return (
    <span
      className={[
        "inline-flex items-center justify-center rounded-full p-1.5 ring-1 ring-inset",
        config.bg,
        config.text,
        config.ring,
        className,
      ].join(" ")}
      aria-label={category}
      title={category}
    >
      <Icon size={size} aria-hidden="true" />
    </span>
  );
}