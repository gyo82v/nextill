"use client";

import { useState } from "react";
import type { IngredientDraftCardProps } from "@/types";
import { inputBaseStyle, selectStyle } from "@/styles";
import Button from "../ui/Button";
import { FiPlus } from "react-icons/fi";


export default function IngredientDraftCard({
  stockItems,
  onAdd,
}: IngredientDraftCardProps) {
  const [stockId, setStockId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const canAdd = stockId.trim().length > 0 && quantity > 0;

  function handleSubmit(e:React.SyntheticEvent) {
    e.preventDefault();

    if (!canAdd) return;

    onAdd({
      stockId,
      quantity,
    });

    setStockId("");
    setQuantity(1);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-default bg-surface-1 p-3 shadow-sm"
    >
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr),120px,auto]">
        <select
          className={selectStyle}
          value={stockId}
          onChange={(e) => setStockId(e.target.value)}
        >
          <option value="">Select stock item</option>
          {stockItems.map((stock) => (
            <option key={stock.id} value={stock.id}>
              {stock.name} ({stock.quantity} {stock.unit})
            </option>
          ))}
        </select>

        <div className="flex flex-col md:flex-row gap-2">
          <input
            className={`${inputBaseStyle} flex-1`}
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <Button
            type="submit"
            variant="secondary"
            className="flex-1"
            loading={false}
            loadingText="adding"
          >
            <FiPlus className="h-4 w-4" />
            <span>Add</span>
          </Button>
        </div>
      </div>
    </form>
  );
}