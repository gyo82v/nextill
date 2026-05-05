"use client";

import type { MenuCategory, AddItemToMenuProps } from "@/types/menu";
import { inputBaseStyle, selectStyle } from "@/styles";
import Button from "../ui/Button";
import IngredientDraftCard from "./IngredientdraftCard";
import IngredientRowCard from "./IngredientRowCard";
import { DotLineDivider } from "../ui/dividers/Dividers";

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
  onSave,
}: AddItemToMenuProps) {
  return (
    <div className="rounded-2xl border border-default bg-surface-1 p-4 shadow-sm sm:p-5 md:p-6">
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
      <div className="mt-4">
        <select
          className={`${selectStyle} `}
          value={category}
          onChange={(e) => setCategory(e.target.value as MenuCategory)}
        >
          <option value=""> Select category</option>
          <option value="food">Food</option>
          <option value="drink">Drink</option>
        </select>
      </div>

      <DotLineDivider className="my-12 xl:my-14" />

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

        {ingredientRows.length > 0 && <DotLineDivider className="my-10 " />}

        {ingredientRows.length > 0 && (
          <div className="space-y-3 mb-12 xl:mb-14">
            <h4 className="font-extralight text-[var(--foreground)]">
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
        loading={false}
        className="w-full mt-6"
      >
        Save item
      </Button>
    </div>
  );
}


/*

"use client";

import type { MenuCategory, AddItemToMenuProps } from "@/types/menu";
import { inputBaseStyle, selectStyle } from "@/styles";
import Button from "../ui/Button";
import { FiTrash2 } from "react-icons/fi";


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
  addIngredientRow,
  updateIngredientRow,
  removeIngredientRow,
  onSave,
}: AddItemToMenuProps) {
  return (
    <div className="rounded-2xl border border-default bg-surface-1 p-4 shadow-sm sm:p-5 md:p-6">

    
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
          Add item
        </h2>
        <p className="text-sm text-muted">
          Select name, price, category and optionally ingredients.
        </p>
      </div>

     
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

  
      <div className="mt-4">
        <select
          className={`${selectStyle} `}
          value={category}
          onChange={(e) => setCategory(e.target.value as MenuCategory)}
        >
          <option value="food">Food</option>
          <option value="drink">Drink</option>
        </select>
      </div>

  
      <div className="mt-6 space-y-3">

     
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-medium text-[var(--foreground)]">
              Ingredients (optional)
            </h3>
            <p className="text-sm text-muted">
              Link stock items to keep menu and inventory connected.
            </p>
          </div>

          <Button
            type="button"
            onClick={addIngredientRow}
            variant="secondary"
            className="shrink-0"
            loading={false}
            loadingText="adding"
          >
            Add ingredient
          </Button>
        </div>


        {ingredientRows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-default bg-surface-2 px-4 py-3 text-sm text-muted">
            No ingredients selected. This item will not interact with stock.
          </div>
        ) : (
          <div className="space-y-3">
            {ingredientRows.map((row, index) => (
              <div
                key={index}
                className="grid gap-2 rounded-2xl border border-default bg-surface-1 p-3 shadow-sm md:grid-cols-[minmax(0,1fr),120px,auto]"
              >
          
                <select
                  className={`${selectStyle} `}
                  value={row.stockId}
                  onChange={(e) =>
                    updateIngredientRow(index, { stockId: e.target.value })
                  }
                >
                  <option value="">Select stock item</option>
                  {stockItems.map((stock) => (
                    <option key={stock.id} value={stock.id}>
                      {stock.name} ({stock.quantity} {stock.unit})
                    </option>
                  ))}
                </select>
                
         
                <div className="flex flex-col gap-2 md:flex-row">
                  <input
                    className={`${inputBaseStyle}`}
                    type="number"
                    min={1}
                    value={row.quantity}
                    onChange={(e) =>
                      updateIngredientRow(index, {
                        quantity: Number(e.target.value),
                    })
                    }
                  />

                  <Button
                    variant="danger"
                    onClick={() => removeIngredientRow(index)}
                    type="button"
                    className="w-full"
                    loading={false}
                    loadingText="removing"
                  >
                    <FiTrash2 className="h-4 w-4 " />
                    <span className="">Remove</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        type="button"
        onClick={onSave}
        loadingText="saving item..."
        loading={false}
        className="w-full mt-6"
      >
        Save item
      </Button>
    </div>
  );
}







*/