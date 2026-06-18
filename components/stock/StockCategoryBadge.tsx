import { IconType } from "react-icons";
import {
  MdLunchDining,
  MdLocalDrink,
  MdInventory2,
  MdOutlineTakeoutDining,
  MdCleaningServices,
  MdCategory,
} from "react-icons/md";

export type StockCategory =
  | "food"
  | "drink"
  | "packaging"
  | "disposableItems"
  | "cleaningSupplies"
  | "other";

const categoryConfig: Record<
  StockCategory,
  {
    icon: IconType;
    bg: string;
    text: string;
    ring: string;
  }
> = {
  food: {
    icon: MdLunchDining,
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
  },
  drink: {
    icon: MdLocalDrink,
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    ring: "ring-cyan-200",
  },
  packaging: {
    icon: MdInventory2,
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    ring: "ring-indigo-200",
  },
  disposableItems: {
    icon: MdOutlineTakeoutDining,
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-200",
  },
  cleaningSupplies: {
    icon: MdCleaningServices,
    bg: "bg-purple-50",
    text: "text-purple-700",
    ring: "ring-purple-200",
  },
  other: {
    icon: MdCategory,
    bg: "bg-zinc-50",
    text: "text-zinc-700",
    ring: "ring-zinc-200",
  },
};

type StockCategoryBadgeProps = {
  category: string;
  className?: string;
  size?: number;
};

export function StockCategoryBadge({
  category,
  className = "",
  size = 16,
}: StockCategoryBadgeProps) {
  const config = categoryConfig[category as StockCategory] ?? categoryConfig.other;
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