"use client";

import { useState } from "react";
import type { IngredientDraftCardProps } from "@/types/menu";
import { inputBaseStyle } from "@/styles";
import Button from "../ui/Button";
import { FiPlus } from "react-icons/fi";
import Select from "../ui/select";
import { useTranslation } from "react-i18next";

export default function IngredientDraftCard({
  stockItems,
  onAdd,
}: IngredientDraftCardProps) {
  const [stockId, setStockId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { t } = useTranslation("menu");

  const canAdd = stockId.trim().length > 0 && quantity > 0;

  const selectedStock = stockItems.find((stock) => stock.id === stockId);

  function handleSubmit(e: React.SyntheticEvent) {
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
      className="rounded-2xl border border-default bg-surface-1 p-3 shadow-sm xl:mb-10"
    >
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr),120px,auto]">
        <Select.Root value={stockId} onValueChange={setStockId} className="w-full">
          <Select.Trigger
            placeholder={t("createSection.form.stockSelectPlaceholder")}
            label={
              selectedStock
                ? `${selectedStock.name} (${selectedStock.quantity} ${selectedStock.unit})`
                : undefined
            }
          />
          <Select.Content>
            {stockItems.map((stock) => (
              <Select.Item key={stock.id} value={stock.id}>
                {stock.name} ({stock.quantity} {stock.unit})
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <div className="flex flex-col gap-2 md:flex-row">
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
          >
            <FiPlus className="h-4 w-4" />
            <span>{t("createSection.form.addIngredient")}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
