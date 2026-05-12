"use client";

import { useMemo, useState } from "react";
import StockItemCard from "./StockItemCard";
import type { StockListProps } from "@/types";
import Select from "../ui/select";
import { inputBaseStyle } from "@/styles";


export default function StockList({ uid, items, loading }: StockListProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | "food" | "drink">("all");

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
          placeholder="Search item…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${inputBaseStyle} flex-2`}
        />

        <Select.Root value={category} onValueChange={setCategory} className="flex-1">
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="all">All</Select.Item>
            <Select.Item value="food">Food</Select.Item>
            <Select.Item value="drink">Drinks</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>

      {/* List */}
      {filteredItems.length === 0 ? (
        <p className="opacity-70">No stock items found.</p>
      ) : (
        <ul className="space-y-3">
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