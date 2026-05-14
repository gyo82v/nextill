"use client";

import { useState } from "react";
import {confirmStockAdjustment, archiveStockItem, updateStockMinQty} from "@/firebase/stock";
import type { StockItemProps } from "@/types";
import Button from "../ui/Button";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { cardBaseStyle, pillTextStyle } from "@/styles";
import ThresholdEdit from "./ThresholdEdit";


export default function StockItemCard({ uid, item }: StockItemProps) {
  const [delta, setDelta] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [minQtyDraft, setMinQtyDraft] = useState(item.minQty);
  const [savingThreshold, setSavingThreshold] = useState(false);

  const isNegativeStock = item.quantity < 0;
  const isLowStock = item.quantity >= 0 && item.quantity <= item.minQty;

  const statusBadgeClass = isNegativeStock ? "text-red-700 border-red-300" :
                           isLowStock ? "text-yellow-800 border-yellow-300":
                                        "text-green-700 border-green-300";

  const statusLabel = isNegativeStock ? "Negative stock" : 
                      isLowStock ? "Low stock" : "In stock";

  async function handleConfirm() {
    if (delta === 0) return;

    setLoading(true);
    await confirmStockAdjustment(uid, item.id, delta);
    setDelta(0);
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    await archiveStockItem(uid, item.id);
    setLoading(false);
  }

  async function handleSaveThreshold() {
    setSavingThreshold(true);
    await updateStockMinQty(uid, item.id, minQtyDraft);
    setSavingThreshold(false);
    setIsEditingThreshold(false);
  }

  function handleCancelThresholdEdit() {
    setMinQtyDraft(item.minQty);
    setIsEditingThreshold(false);
  }

  return (
    <article className={`${cardBaseStyle} p-4`}>
      <header className="flex items-center justify-between">
        <div className="font-medium flex items-center gap-2">
          {item.name}

          <span className={`text-xs border px-2 py-0.5 rounded ${statusBadgeClass}`}>
            {statusLabel}
          </span>
        </div>

        <Button
          type="button"
          variant="danger"
          disabled={loading}
          loading={false}
          aria-label={`Delete ${item.name}`}
          title={`Delete ${item.name}`}
          onClick={handleDelete}  
        >
          <FiTrash2 className="h-4 w-4" />
        </Button>
      </header>

      <div className="my-5 h-px bg-[var(--divider)] opacity-60" />

      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm opacity-70">
            {item.category} · {item.quantity} {item.unit}
          </div>

          <div className="text-sm opacity-70 flex items-center gap-2">
            <span>Low stock threshold: {item.minQty}</span>
          </div>

          <button
              type="button"
              onClick={() => setIsEditingThreshold((prev) => !prev)}
              className="text-xs underline hover:font-bold"
          >
            Edit
          </button>
        </div>

        {isEditingThreshold && 
        <>
        <div className="my-5 h-px bg-[var(--divider)] opacity-60 sm:hidden" />
        <ThresholdEdit 
          minQty={minQtyDraft} 
          setMinQty={(e) => setMinQtyDraft(Number(e.target.value))}
          handleCancel={handleCancelThresholdEdit}
          handleSave={handleSaveThreshold} 
          savingThreshold={savingThreshold}
          className="sm:hidden"
          />
        </>
        }

        <div className="my-5 h-px bg-[var(--divider)] opacity-60 sm:hidden" />

        <div className="text-center mb-5 sm:mb-0">
         <div className="flex items-center gap-1">
            <Button 
              type="button"
              variant="ghost"
              onClick={() => setDelta((d) => d - 1)}>
              <FiMinus className="h-4 w-4" />
            </Button>


            <span className={pillTextStyle}>{delta}</span>

            <Button 
              variant="ghost"
              type="button"
              onClick={() => setDelta((d) => d + 1)}>
              <FiPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          type="button"
          variant={delta >= 0 ? "confirm" : "danger"}
          onClick={handleConfirm}
          disabled={loading || delta === 0}
          loading={false}
          className="w-full sm:w-2/12"
        >
          {delta >= 0 ? "Add" : "Remove"}
        </Button>
      </section>

      {isEditingThreshold && 
        <>
        <div className="my-5 h-px bg-[var(--divider)] opacity-60 hidden sm:block" />
        <ThresholdEdit 
          minQty={minQtyDraft} 
          setMinQty={(e) => setMinQtyDraft(Number(e.target.value))}
          handleCancel={handleCancelThresholdEdit}
          handleSave={handleSaveThreshold} 
          savingThreshold={savingThreshold}
          className="hidden sm:flex"
          />
        </>
        }
    </article>
  );
}


/*

<article className={` p-4 flex items-center justify-between ${cardBaseStyle} `}>
      <div className="space-y-2 ">
        <div className="font-medium flex items-center gap-2">
          {item.name}

          <span className={`text-xs border px-2 py-0.5 rounded ${statusBadgeClass}`}>
            {statusLabel}
          </span>
        </div>

        <div className="text-sm opacity-70">
          {item.category} · {item.quantity} {item.unit}
        </div>

        <div className="text-sm opacity-70 flex items-center gap-2">
          <span>Low stock threshold: {item.minQty}</span>

          <button
            type="button"
            onClick={() => setIsEditingThreshold((prev) => !prev)}
            className="text-xs underline"
          >
            Edit
          </button>
        </div>

        {isEditingThreshold && (
          <div className="flex items-center gap-2 ">
            <input
              type="number"
              min={0}
              value={minQtyDraft}
              onChange={(e) => setMinQtyDraft(Number(e.target.value))}
              className="w-24 rounded border px-2 py-1 text-sm"
            />

            <button
              type="button"
              onClick={handleSaveThreshold}
              disabled={savingThreshold}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              Save
            </button>

            <button
              type="button"
              onClick={handleCancelThresholdEdit}
              className="rounded border px-3 py-1 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
          <Button
            type="button"
            variant="confirm"
            onClick={handleConfirm}
            disabled={loading || delta === 0}
            loading={false}
          >
            Confirm
          </Button>

         <div>
            <Button 
              type="button"
              variant="ghost"
              onClick={() => setDelta((d) => d - 1)}>
              <FiMinus className="h-4 w-4" />
            </Button>


            <span className={pillTextStyle}>{delta}</span>

            <Button 
              variant="ghost"
              type="button"
              onClick={() => setDelta((d) => d + 1)}>
              <FiPlus className="h-4 w-4" />
            </Button>
          </div>
      </div>


      <Button
        type="button"
        variant="danger"
        disabled={loading}
        loading={false}
        aria-label={`Delete ${item.name}`}
        title={`Delete ${item.name}`}
        onClick={handleDelete}  
      >
        <FiTrash2 className="h-4 w-4" />
      </Button>
    </article>









*/

