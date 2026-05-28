"use client";

import { useMemo } from "react";
import MenuItemCard from "../pos/MenuItemCard";
import type { MenuItem } from "@/types";
import { FaUtensils, FaMugSaucer, FaPlateWheat } from "react-icons/fa6";

type Props = {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
};

const CATEGORY_META = {
  food: {
    label: "Food",
    description: "Meals, mains, and anything savory.",
    icon: <FaUtensils className="text-sm" aria-hidden="true" />,
  },
  drink: {
    label: "Drinks",
    description: "Soft drinks, water, coffee, and more.",
    icon: <FaMugSaucer className="text-sm" aria-hidden="true" />,
  },
  bundle: {
    label: "Combo",
    description: "Food and drinks sold together.",
    icon: <FaPlateWheat className="text-sm" aria-hidden="true" />,
  },
} as const;

export default function MenuList({ items, onAdd }: Props) {
  const grouped = useMemo(() => {
    return {
      food: items.filter((item) => item.category === "food"),
      drink: items.filter((item) => item.category === "drink"),
      bundle: items.filter((item) => item.category === "bundle"),
    };
  }, [items]);

  const sections = [
    { key: "food", items: grouped.food },
    { key: "drink", items: grouped.drink },
    { key: "bundle", items: grouped.bundle },
  ] as const;

  return (
    <section aria-label="Menu items" className="space-y-7">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Menu</h2>
        <p className="text-sm text-muted-foreground">
          Tap a dish to add it to the cart.
        </p>
      </header>

      <div className="space-y-7">
        {sections.map(({ key, items: sectionItems }) => {
          if (sectionItems.length === 0) return null;

          const meta = CATEGORY_META[key];

          return (
            <section
              key={key}
              aria-labelledby={`menu-section-${key}`}
              className="space-y-3"
            >
              <header className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-default bg-surface-2 text-muted-foreground">
                      {meta.icon}
                    </span>
                    <h3
                      id={`menu-section-${key}`}
                      className="text-base font-semibold"
                    >
                      {meta.label}
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {meta.description}
                  </p>
                </div>

                <span className="rounded-full border border-default bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {sectionItems.length} items
                </span>
              </header>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {sectionItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAdd={onAdd}
                    categoryLabel={meta.label}
                    categoryIcon={meta.icon}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

/*

"use client";

import { useMemo } from "react";
import MenuItemCard from "../pos/MenuItemCard";
import type { MenuItem } from "@/types";
import { FaUtensils, FaMugSaucer, FaPlateWheat } from "react-icons/fa6";

type Props = {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
};

const CATEGORY_META = {
  food: {
    label: "Food",
    description: "Meals, mains, and anything savory.",
    icon: <FaUtensils className="text-sm" aria-hidden="true" />,
  },
  drink: {
    label: "Drinks",
    description: "Soft drinks, water, coffee, and more.",
    icon: <FaMugSaucer className="text-sm" aria-hidden="true" />,
  },
  bundle: {
    label: "Combo",
    description: "Food and drinks sold together.",
    icon: <FaPlateWheat className="text-sm" aria-hidden="true" />,
  },
} as const;

export default function MenuList({ items, onAdd }: Props) {
  const grouped = useMemo(() => {
    return {
      food: items.filter((item) => item.category === "food"),
      drink: items.filter((item) => item.category === "drink"),
      bundle: items.filter((item) => item.category === "bundle"),
    };
  }, [items]);

  const sections = [
    { key: "food", items: grouped.food },
    { key: "drink", items: grouped.drink },
    { key: "bundle", items: grouped.bundle },
  ] as const;

  return (
    <section aria-label="Menu items" className="space-y-8">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Menu</h2>
        <p className="text-sm text-muted-foreground">
          Tap a dish to add it to the cart.
        </p>
      </header>

      <div className="space-y-8">
        {sections.map(({ key, items: sectionItems }) => {
          if (sectionItems.length === 0) return null;

          const meta = CATEGORY_META[key];

          return (
            <section
              key={key}
              aria-labelledby={`menu-section-${key}`}
              className="space-y-4"
            >
              <header className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-default bg-surface-2 text-muted-foreground">
                      {meta.icon}
                    </span>
                    <h3
                      id={`menu-section-${key}`}
                      className="text-base font-semibold"
                    >
                      {meta.label}
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {meta.description}
                  </p>
                </div>

                <span className="rounded-full border border-default bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {sectionItems.length} items
                </span>
              </header>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {sectionItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAdd={onAdd}
                    categoryLabel={meta.label}
                    categoryIcon={meta.icon}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}






*/