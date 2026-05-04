"use client";

import type { StockItem } from "@/firebase/stock";
import { inputBaseStyle } from "@/styles";
import Button from "../ui/Button";
import { FiTrash2 } from "react-icons/fi";

type IngredientRowCardProps = {
  stockId: string;
  quantity: number;
  stockItems: StockItem[];
  onRemove: () => void;
};

export default function IngredientRowCard({
  stockId,
  quantity,
  stockItems,
  onRemove,
}: IngredientRowCardProps) {
  const stock = stockItems.find((item) => item.id === stockId);

  return (
    <div className="grid gap-2 rounded-2xl border border-default bg-surface-1 p-3 shadow-sm md:grid-cols-[minmax(0,1fr),120px,auto]">
      <div className={inputBaseStyle}>
        {stock ? `${stock.name} (${stock.quantity} ${stock.unit})` : "Unknown stock item"}
      </div>

      <input
        className={inputBaseStyle}
        type="number"
        min={1}
        value={quantity}
        readOnly
      />

      <Button
        variant="danger"
        onClick={onRemove}
        type="button"
        className="w-full"
        loading={false}
        loadingText="removing"
      >
        <FiTrash2 className="h-4 w-4" />
        <span>Remove</span>
      </Button>
    </div>
  );
}