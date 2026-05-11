"use client";

import { useState } from "react";
import { createStockItem } from "@/firebase/stock";
import type { StockFormProps, DraftStockCategory } from "@/types";
import { inputBaseStyle } from "@/styles";
import Select from "../ui/select";
import Button from "../ui/Button";


export default function AddStockItemForm({ uid }: StockFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<DraftStockCategory>("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("");
  const [minQty, setMinQty] = useState(5);
  const [loading, setLoading] = useState(false);

  const categoryLabel =
    category === "food"
    ? "food"
    : category === "drink"
      ? "drink"
      : undefined;

  async function handleSubmit(e:React.SyntheticEvent) {
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
    setCategory("");
    setQuantity(0);
    setUnit("");
    setMinQty(5);

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4 rounded-2xl border border-default bg-surface-1 p-4 shadow-sm sm:p-5 md:p-6"
    >
      <div className="mb-8">
        <h2 className="text-lg font-medium">Add stock item</h2>
        <p>description here</p>
      </div>

      <div className="xl:my-8 space-y-4">
        <input
          className={`${inputBaseStyle}`}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="grid gap-3 md:grid-cols-2">
          <Select.Root value={category} onValueChange={setCategory}>
            <Select.Trigger placeholder="Select category" label={categoryLabel}/>
            <Select.Content>
              <Select.Item value="food">Food</Select.Item>
              <Select.Item value="drink">Drink</Select.Item>
            </Select.Content>
          </Select.Root>

          <input
            className={`${inputBaseStyle}`}
            placeholder="Unit (e.g. pcs, ml, g)"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="">
             <label className="text-sm  ml-3" htmlFor="quantity">Initial quantity</label>
              <input
                type="number"
                id="quantity"
                min={0}
                className={`${inputBaseStyle}`}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
          </div>
          <div className="">
            <label className="text-sm  ml-3" htmlFor="minQty">Low stock threshold</label>
            <input
              type="number"
              id="minQty"
              min={0}
              className={`${inputBaseStyle}`}
              value={minQty}
              onChange={(e) => setMinQty(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        loading={loading}
        loadingText="Creating..."
        className="w-full mt-8"
        disabled={loading || !category || !name || !quantity || !minQty || !unit}
      >
        Create Stock Item
      </Button>
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