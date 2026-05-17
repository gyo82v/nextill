"use client";

import { useState } from "react";
import { createStockItem } from "@/firebase/stock";
import type { StockFormProps, DraftStockCategory } from "@/types";
import { inputBaseStyle } from "@/styles";
import Select from "../ui/select";
import Button from "../ui/Button";
import { useTranslation } from "react-i18next";


export default function AddStockItemForm({ uid }: StockFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<DraftStockCategory>("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("");
  const [minQty, setMinQty] = useState(5);
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation("stock")

  const categoryLabel =
    category === "food"
    ? t("createSection.form.food")
    : category === "drink"
      ? t("createSection.form.drink")
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
      className={`w-full space-y-4 rounded-2xl border border-default
                  bg-surface-1 p-4 shadow-sm sm:p-5 md:p-6`}
    >
      <div className="mb-8">
        <h2 className="text-lg font-medium">{t("createSection.form.title")}</h2>
        <p>{t("createSection.form.description")}</p>
      </div>

      <div className="xl:my-8 space-y-4">
        <input
          className={`${inputBaseStyle}`}
          placeholder={t("createSection.form.name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="grid gap-3 md:grid-cols-2">
          <Select.Root value={category} onValueChange={setCategory}>
            <Select.Trigger placeholder={t("createSection.form.placeholder")} label={categoryLabel}/>
            <Select.Content>
              <Select.Item value="food">{t("createSection.form.food")}</Select.Item>
              <Select.Item value="drink">{t("createSection.form.drink")}</Select.Item>
            </Select.Content>
          </Select.Root>

          <input
            className={`${inputBaseStyle}`}
            placeholder={t("createSection.form.unit")}
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="">
             <label className="text-sm  ml-3" htmlFor="quantity">
              {t("createSection.form.quantity")}
             </label>
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
            <label className="text-sm  ml-3" htmlFor="minQty">
              {t("createSection.form.lowStock")}
            </label>
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
        loadingText={t("createSection.form.createItemLoading")}
        className="w-full mt-8"
        disabled={loading || !category || !name || !quantity || !minQty || !unit}
      >
        {t("createSection.form.createItem")}
      </Button>
    </form>
  );
}
