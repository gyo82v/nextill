"use client";

import { useMemo } from "react";
import MenuItemCard from "../pos/MenuItemCard";
import { FaUtensils, FaMugSaucer, FaPlateWheat, FaCakeCandles } from "react-icons/fa6";
import { SmallDivider } from "@/components/ui/dividers/Dividers";
import type { MenuListProps } from "@/types/pos";
import { useTranslation } from "react-i18next";

export default function MenuList({ items, onAdd }: MenuListProps) {
  const { t } = useTranslation("pos");

  const CATEGORY_META = {
  food: {
    label: `${t("menu.foodTitle")}`,
    description: `${t("menu.foodDescription")}`,
    icon: <FaUtensils className="text-sm" aria-hidden="true" />,
  },
  drink: {
    label: `${t("menu.drinksTitle")}`,
    description: `${t("menu.drinksDescription")}`,
    icon: <FaMugSaucer className="text-sm" aria-hidden="true" />,
  },
  bundle: {
    label: `${t("menu.comboTitle")}`,
    description: `${t("menu.comboDescription")}`,
    icon: <FaPlateWheat className="text-sm" aria-hidden="true" />,
  },
  dessert: {
    label: `${t("menu.dessertsTitle")}`,
    description: `${t("menu.dessertsDescription")}`,
    icon: <FaCakeCandles className="text-sm" aria-hidden="true" />,
  },
} as const;
  const grouped = useMemo(() => {
    return {
      food: items.filter((item) => item.category === "food"),
      drink: items.filter((item) => item.category === "drink"),
      bundle: items.filter((item) => item.category === "bundle"),
      dessert: items.filter((item) => item.category === "dessert")
    };
  }, [items]);

  const sections = [
    { key: "food", items: grouped.food },
    { key: "drink", items: grouped.drink },
    { key: "bundle", items: grouped.bundle },
    { key: "dessert", items: grouped.dessert }
  ] as const;

  let renderedSections = 0;

  return (
    <section aria-label="Menu items" className="space-y-7">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{t("menu.title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("menu.description")}
        </p>
      </header>

      <SmallDivider className="my-10" />

      <div className="space-y-7">
        {sections.map(({ key, items: sectionItems }) => {
          if (sectionItems.length === 0) return null;

          renderedSections += 1;
          const isLastRendered =
            renderedSections ===
            sections.filter((s) => s.items.length > 0).length;

          const meta = CATEGORY_META[key];

          return (
            <div key={key} className="space-y-13">
              <section
                aria-labelledby={`menu-section-${key}`}
                className="space-y-3"
              >
                <header className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full
                                        border border-default bg-surface-2 text-muted-foreground`}>
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

                  <span className={`rounded-full border border-default bg-surface-2
                                    px-2.5 py-1 text-xs font-medium text-muted-foreground`}>
                    {t("menu.sectionItems", { count: sectionItems.length })}
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

              {!isLastRendered && <SmallDivider className="my-10" />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
