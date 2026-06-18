"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import type { MenuListProps } from "@/types/menu";
import MenuItem from "./MenuItem";
import Select from "../ui/select";
import { inputBaseStyle } from "@/styles";
import { DotLineDivider } from "@/components/ui/dividers/Dividers";

type MenuCategory = "all" | "food" | "drink" | "dessert" | "bundle";

export default function MenuList({
  loading,
  menuItems,
  stockItems,
  currency,
  deletingMenuId,
  onDelete,
}: MenuListProps) {
  const { t } = useTranslation("menu");

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<MenuCategory>("all");

  const categoryLabel =
    category === "food"
      ? t("listSection.food")
      : category === "drink"
      ? t("listSection.drink")
      : category === "dessert"
      ? t("listSection.dessert")
      : category === "bundle"
      ? t("listSection.bundle")
      : category === "all"
      ? t("listSection.all")
      : undefined;

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesQuery = item.name
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesCategory =
        category === "all" || item.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [menuItems, query, category]);

  return (
    <div className="space-y-4">
      {/* Search + filter */}
      <div className="flex gap-2 max-w-lg">
        <input
          type="text"
          placeholder={t("listSection.searchBar")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${inputBaseStyle} flex-2`}
        />

        <Select.Root
          value={category}
          onValueChange={setCategory}
          className="flex-2"
        >
          <Select.Trigger label={categoryLabel} />
          <Select.Content>
            <Select.Item value="all">{t("listSection.all")}</Select.Item>
            <Select.Item value="food">{t("listSection.food")}</Select.Item>
            <Select.Item value="drink">{t("listSection.drink")}</Select.Item>
            <Select.Item value="dessert">{t("listSection.dessert")}</Select.Item>
            <Select.Item value="bundle">{t("listSection.bundle")}</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>

      <DotLineDivider className="my-10 hidden lg:inline-flex" />

      {/* List */}
      {loading ? (
        <p className="opacity-70">{t("loading")}</p>
      ) : filteredItems.length === 0 ? (
        <p className="opacity-70">{t("listSection.emptyState")}</p>
      ) : (
        <ul className="space-y-3 lg:space-y-4 xl:space-y-5">
          {filteredItems.map((item) => (
            <li key={item.id}>
              <MenuItem
                item={item}
                stockItems={stockItems}
                currency={currency}
                loading={deletingMenuId === item.id}
                onDelete={onDelete}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


/*

"use client";

import type { MenuListProps } from "@/types/menu";
import MenuItem from "./MenuItem";
import { useTranslation } from "react-i18next";

export default function MenuList({
  loading,
  menuItems,
  stockItems,
  currency,
  deletingMenuId,
  onDelete,
}: MenuListProps) {
  const { t } = useTranslation("menu");
  return (
    <div className="space-y-3 ">

      {loading ? (
        <p className="opacity-70">{t("loading")}</p>
      ) : menuItems.length === 0 ? (
        <p className="opacity-70">{t("listSection.emptyState")}</p>
      ) : (
        <div className="space-y-3">
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              stockItems={stockItems}
              currency={currency}
              loading={deletingMenuId === item.id}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}



*/