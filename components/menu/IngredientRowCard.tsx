"use client";

import type { StockItem } from "@/firebase/stock";
import { pillTextStyle } from "@/styles";
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
    <div className="flex gap-2 rounded-2xl border border-default bg-surface-1 p-3 shadow-sm md:grid-cols-[minmax(0,1fr),120px,auto]">
      <div className={`${pillTextStyle} text-center`}>
        {stock ? `${stock.name} ` : "Unknown stock item"}
      </div>

      <div className={`${pillTextStyle} text-center`}>
        <span>{quantity}</span>
      </div>

      <Button
        variant="danger"
        onClick={onRemove}
        type="button"
        className="w-full"
        loading={false}
        loadingText="removing"
      >
        <FiTrash2 className="h-4 w-4" />
        <span className="hidden lg:block">Remove</span>
      </Button>
    </div>
  );
}