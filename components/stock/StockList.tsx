"use client";

import { useMemo, useState } from "react";
import StockItemCard from "./StockItemCard";
import type { StockListProps } from "@/types";
import Select from "../ui/select";
import { inputBaseStyle } from "@/styles";
import { DotLineDivider } from "@/components/ui/dividers/Dividers";
import { useTranslation } from "react-i18next";


export default function StockList({ uid, items }: StockListProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | "food" | "drink" | "packaging" | "disposableItems" | "cleaningSupplies" | "other">("all");
  const {t} = useTranslation("stock")

  const categoryLabel =
    category === "food"
    ? t("stockSection.food")
    : category === "drink"
    ? t("stockSection.drink")
    : category === "packaging"
    ? t("stockSection.packaging")
    : category === "disposableItems"
    ? t("stockSection.disposableItems")
    : category === "cleaningSupplies"
    ? t("stockSection.cleaningSupplies")
    : category === "other"
    ? t("stockSection.other")
    : undefined

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery =
        item.name.toLowerCase().includes(query.toLowerCase());

      const matchesCategory =
        category === "all" || item.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [items, query, category]);

  return (
    <div className="space-y-4">
      {/* Search + filter */}
      <div className="flex gap-2 max-w-lg">
        <input
          type="text"
          placeholder={t("stockSection.searchBar")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${inputBaseStyle} flex-2`}
        />

        <Select.Root value={category} onValueChange={setCategory} className="flex-2">
          <Select.Trigger label={categoryLabel} />
          <Select.Content>
            <Select.Item value="all">{t("stockSection.all")}</Select.Item>
            <Select.Item value="food">{t("stockSection.food")}</Select.Item>
            <Select.Item value="drink">{t("stockSection.drink")}</Select.Item>
            <Select.Item value="packaging">{t("stockSection.packaging")}</Select.Item>
            <Select.Item value="disposableItems">{t("stockSection.disposableItems")}</Select.Item>
            <Select.Item value="cleaningSupplies">{t("stockSection.cleaningSupplies")}</Select.Item>
            <Select.Item value="other">{t("stockSection.other")}</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>

      <DotLineDivider className="my-10 hidden lg:inline-flex" />

      {/* List */}
      {filteredItems.length === 0 ? (
        <p className="opacity-70">{t("stockSection.emptyStock")}.</p>
      ) : (
        <ul className="space-y-3 lg:space-y-4 xl:space-y-5">
          {filteredItems.map((item) => (
            <li key={item.id}>
              <StockItemCard uid={uid} item={item}/>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
