"use client";

import type {AddItemToMenuProps} from "@/types/menu";
import {inputBaseStyle} from "@/styles";
import Button from "../ui/Button";
import IngredientDraftCard from "./IngredientdraftCard";
import IngredientRowCard from "./IngredientRowCard";
import { DotLineDivider } from "../ui/dividers/Dividers";
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

  return (
    <div className="rounded-2xl border border-default bg-surface-1 p-4 shadow-sm sm:p-5 md:p-6 ">
      {/* Title and description */}
      <div className="">
        <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
          Add item
        </h2>
        <p className="text-sm text-muted">
          Select name, price, category and optionally ingredients.
        </p>
      </div>

      {/* Name and price inputs */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          className={`${inputBaseStyle}`}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className={`${inputBaseStyle}`}
          type="number"
          step="0.01"
          min="0"
          placeholder={`Price (${currency})`}
          value={priceDisplay}
          onChange={(e) => setPriceDisplay(e.target.value)}
        />
      </div>

      {/* Category selector */}
      <div className="mt-4 ">
        <Select.Root value={category} onValueChange={setCategory} className="w-full" >
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="food">Food</Select.Item>
            <Select.Item value="drink">Drink</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>

      <DotLineDivider className="my-12 xl:my-16" />

      {/* Ingredients section */}
      <div className="space-y-3">
        {/* Section title, description and add button */}
        <div className="mb-6">
          <div>
            <h3 className="font-extralight text-[var(--foreground)]">
              {`${"ingredients ".toUpperCase()}(optional)`}
            </h3>
            <p className="text-sm text-muted">
              Link stock items to keep menu and inventory connected.
            </p>
          </div>
        </div>

        <IngredientDraftCard
          stockItems={stockItems}
          onAdd={onAddIngredient}
        />

        {ingredientRows.length > 0 && <DotLineDivider className="my-12 xl:my-16" />}

        {ingredientRows.length > 0 && (
          <div className="space-y-3 mb-12 xl:mb-14">
            <h4 className="font-extralight text-[var(--foreground)] mb-6">
              {`${"ingredients added:".toUpperCase()}`}
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
        loadingText="saving item..."
        loading={loading}
        className="w-full mt-6"
        disabled={!name.trim() || !priceDisplay.trim() || !category}
      >
        Save item
      </Button>
    </div>
  );
}
