"use client";

import { useState } from "react";
import { createStockItem } from "@/firebase/stock";

type Props = {
  uid: string;
};

export default function AddStockItemForm({ uid }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"food" | "drink">("food");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("");
  const [minQty, setMinQty] = useState(5);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);

    await createStockItem(uid, {
      name,
      category,
      quantity,
      unit,
      minQty,
    });

    setName("");
    setCategory("food");
    setQuantity(0);
    setUnit("");
    setMinQty(5);

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl rounded border p-4 space-y-4"
    >
      <h2 className="text-lg font-medium">Add stock item</h2>

      <input
        className="w-full rounded border px-3 py-2"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="grid gap-3 md:grid-cols-2">
        <select
          className="rounded border px-3 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value as "food" | "drink")}
        >
          <option value="food">Food</option>
          <option value="drink">Drink</option>
        </select>

        <input
          className="rounded border px-3 py-2"
          placeholder="Unit (e.g. pcs, ml, g)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <input
          type="number"
          min={0}
          className="rounded border px-3 py-2"
          placeholder="Initial quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <input
          type="number"
          min={0}
          className="rounded border px-3 py-2"
          placeholder="Low stock threshold"
          value={minQty}
          onChange={(e) => setMinQty(Number(e.target.value))}
        />

        <div className="text-sm opacity-70 flex items-center">
          Warn at ≤ {minQty}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Saving…" : "Create stock item"}
      </button>
    </form>
  );
}

/*

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






*/