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
  const [category, setCategory] = useState<"all" | "food" | "drink">("all");
  const {t} = useTranslation("stock")

  const categoryLabel =
    category === "food"
    ? t("stockSection.food")
    : category === "drink"
      ? t("stockSection.drink")
      : t("stockSection.all");

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

        <Select.Root value={category} onValueChange={setCategory} className="flex-1">
          <Select.Trigger label={categoryLabel} />
          <Select.Content>
            <Select.Item value="all">{t("stockSection.all")}</Select.Item>
            <Select.Item value="food">{t("stockSection.food")}</Select.Item>
            <Select.Item value="drink">{t("stockSection.drink")}</Select.Item>
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



/*
"use client";

import StockItemCard from "./StockItemCard";
import type { StockItem } from "@/firebase/stock";

type Props = {
  uid: string;
  items: StockItem[];
  onChange: () => void;
};

export default function StockList({ uid, items, onChange }: Props) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-medium">Current stock</h2>

      {items.length === 0 ? (
        <p className="opacity-70">No stock items.</p>
      ) : (
        items.map((item) => (
          <StockItemCard
            key={item.id}
            uid={uid}
            item={item}
            onChange={onChange}
          />
        ))
      )}
    </div>
  );
}
  */