"use client";

import { useMemo, useState } from "react";
import StockItemCard from "./StockItemCard";
import type { StockItem } from "@/firebase/stock";

type Props = {
  uid: string;
  items: StockItem[];
};

export default function StockList({ uid, items }: Props) {
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
      <h2 className="text-lg font-medium">Current stock</h2>

      {/* Search + filter */}
      <div className="flex gap-2 max-w-lg">
        <input
          type="text"
          placeholder="Search item…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as "all" | "food" | "drink")
          }
          className="border rounded px-3 py-2"
        >
          <option value="all">All</option>
          <option value="food">Food</option>
          <option value="drink">Drink</option>
        </select>
      </div>

      {/* List */}
      {filteredItems.length === 0 ? (
        <p className="opacity-70">No stock items found.</p>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <StockItemCard
              key={item.id}
              uid={uid}
              item={item}
            />
          ))}
        </div>
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