"use client";

import { useState } from "react";
import { createStockItem } from "@/firebase/stock";

type Props = {
  uid: string;
};

export default function AddStockItemForm({uid}: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"food" | "drink">("food");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("pcs");
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!name.trim()) return;

    setLoading(true);
    await createStockItem(uid, {
      name,
      category,
      quantity,
      unit,
    });

    setName("");
    setQuantity(0);
    setUnit("pcs");
    setLoading(false);
  }

  return (
    <div className="border rounded p-4 space-y-3 max-w-md">
      <h2 className="font-medium">Add stock item</h2>

      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="flex gap-2">
        <select
          className="border rounded px-3 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value as "food" | "drink")}
        >
          <option value="food">Food</option>
          <option value="drink">Drink</option>
        </select>

        <input
          type="number"
          className="border rounded px-3 py-2 w-24"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <input
          className="border rounded px-3 py-2 w-24"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
      </div>

      <button
        onClick={handleAdd}
        disabled={loading}
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
      >
        Add item
      </button>
    </div>
  );
}