"use client";

import type {AddItemToMenuProps} from "@/types/menu";
import {inputBaseStyle} from "@/styles";
import Button from "../ui/Button";
import IngredientDraftCard from "./IngredientdraftCard";
import IngredientRowCard from "./IngredientRowCard";
import { DotLineDivider } from "../ui/dividers/Dividers";
import { useTranslation } from "react-i18next";
import Select from "../ui/select";

export default function AddItemToMenu({
  currency,
  stockItems,
  name,
  setName,
  priceDisplay,
  setPriceDisplay,
  category,
  setCategory,
  ingredientRows,
  onAddIngredient,
  removeIngredientRow,
  loading,
  onSave,
}: AddItemToMenuProps) {
  const { t } = useTranslation("menu");
  const categoryLabel =
  category === "food"
    ? t("createSection.form.categories.food")
    : category === "drink"
      ? t("createSection.form.categories.drinks")
    : category === "bundle"
      ? t("createSection.form.categories.bundle")
    : category === "dessert"
      ? t("createSection.form.categories.dessert")
      : undefined;
  
      console.log("stock items: ", stockItems)

  return (
    <div className=" rounded-2xl border border-default bg-surface-1 p-4 shadow-sm sm:p-5 md:p-6  ">
      {/* Title and description */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
          {t("createSection.form.title")}
        </h2>
        <p className="text-sm text-muted">
          {t("createSection.form.description")}
        </p>
      </div>

      {/* Name and price inputs */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          className={`${inputBaseStyle}`}
          placeholder={t("createSection.form.namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className={`${inputBaseStyle}`}
          type="number"
          step="0.01"
          min="0"
          placeholder={t("createSection.form.pricePlaceholder", { currency })}
          value={priceDisplay}
          onChange={(e) => setPriceDisplay(e.target.value)}
        />
      </div>

      {/* Category selector */}
      <div className="mt-4 ">
        <Select.Root value={category} onValueChange={setCategory} className="w-full" >
          <Select.Trigger placeholder={t("createSection.form.categoryPlaceholder")} label={categoryLabel} />
          <Select.Content>
            <Select.Item value="food">{t("createSection.form.categories.food")}</Select.Item>
            <Select.Item value="drink">{t("createSection.form.categories.drinks")}</Select.Item>
            <Select.Item value="bundle">{t("createSection.form.categories.bundle")}</Select.Item>
            <Select.Item value="dessert">{t("createSection.form.categories.dessert")}</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
     
      <DotLineDivider className="my-12 xl:my-16" />

      {/* Ingredients section */}
      <div className="space-y-3">
        {/* Section title, description and add button */}
        {stockItems.length > 0 ?
        <div className="mb-6">
          <div>
            <h3 className="font-extralight text-[var(--foreground)]">
              <span className="mr-1">{t("createSection.form.ingredientsTitle").toUpperCase()}</span>
              <span>{t("createSection.form.ingredientsOptional")}</span>
            </h3>
            <p className="text-sm text-muted">
              {t("createSection.form.ingredientsDescription")}
            </p>
          </div>
        </div> :

        <div className="mb-6">
           <h3 className="font-extralight text-[var(--foreground)]">
              <span className="mr-1">{t("createSection.form.emptyStockTitle").toUpperCase()}</span>
            </h3>
            <p className="text-sm text-muted">
              {t("createSection.form.emptyStockDescription")}
            </p>
        </div>
        }

        {stockItems.length > 0 && 
          <IngredientDraftCard
            stockItems={stockItems}
            onAdd={onAddIngredient}
          />
        }

        {ingredientRows.length > 0 && <DotLineDivider className="my-12 xl:my-16" />}

        {ingredientRows.length > 0 && (
          <div className="space-y-3 mb-12 xl:mb-14">
            <h4 className="font-extralight text-[var(--foreground)] mb-6">
              {`${t("createSection.form.addedIngredientsTitle").toUpperCase()}`}
            </h4>

            {ingredientRows.map((row, index) => (
              <IngredientRowCard
                key={`${row.stockId}-${index}`}
                stockId={row.stockId}
                quantity={row.quantity}
                stockItems={stockItems}
                onRemove={() => removeIngredientRow(index)}
              />
            ))}
          </div>
        )}
      </div>

      <Button
        type="button"
        onClick={onSave}
        loadingText={t("createSection.form.submitting")}
        loading={loading}
        className="w-full mt-6"
        disabled={!name.trim() || !priceDisplay.trim() || !category}
      >
        {t("createSection.form.submit")}
      </Button>
    </div>
  );
}

