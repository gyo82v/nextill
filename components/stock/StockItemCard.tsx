"use client";

import { useState } from "react";
import {
  confirmStockAdjustment,
  archiveStockItem,
  updateStockMinQty,
} from "@/firebase/stock";
import type { StockItemProps } from "@/types";
import Button from "../ui/Button";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { cardBaseStyle, pillTextStyle } from "@/styles";
import ThresholdEdit from "./ThresholdEdit";
import { useTranslation } from "react-i18next";

export default function StockItemCard({ uid, item }: StockItemProps) {
  const [delta, setDelta] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [updatingQuantity, setUpdatingQuantity] = useState(false);
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [minQtyDraft, setMinQtyDraft] = useState(item.minQty);
  const [savingThreshold, setSavingThreshold] = useState(false);
  const {t} = useTranslation("stock")
  const categoryLabel = t(`stockSection.item.categories.${item.category}`, {
     defaultValue: item.category,
    });

  const isNegativeStock = item.quantity < 0;
  const isLowStock = item.quantity >= 0 && item.quantity <= item.minQty;

  const statusBadgeClass = isNegativeStock
    ? "text-red-700 border-red-300"
    : isLowStock
    ? "text-yellow-800 border-yellow-300"
    : "text-green-700 border-green-300";

  const statusLabel = isNegativeStock
    ? t("stockSection.item.negativeStock")
    : isLowStock
    ? t("stockSection.item.lowStock")
    : t("stockSection.item.inStock")

  async function handleConfirm() {
    if (delta === 0 || updatingQuantity) return;

    try {
      setUpdatingQuantity(true);
      await confirmStockAdjustment(uid, item.id, delta);
      setDelta(0);
    } finally {
      setUpdatingQuantity(false);
    }
  }

  async function handleDelete() {
    if (deleting) return;

    try {
      setDeleting(true);
      await archiveStockItem(uid, item.id);
    } finally {
      setDeleting(false);
    }
  }

  async function handleSaveThreshold() {
    if (savingThreshold) return;

    try {
      setSavingThreshold(true);
      await updateStockMinQty(uid, item.id, minQtyDraft);
      setIsEditingThreshold(false);
    } finally {
      setSavingThreshold(false);
    }
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
          disabled={deleting}
          loading={deleting}
          aria-label={t("stockSection.item.deleteItem", { name: item.name })}
          title={t("stockSection.item.deleteItem", { name: item.name })}
          onClick={handleDelete}
        >
          <FiTrash2 className="h-4 w-4" />
        </Button>
      </header>

      <div className="my-5 h-px bg-[var(--divider)] opacity-60" />

      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm opacity-70">
            {categoryLabel} · {item.quantity} {item.unit}
          </div>

          <div className="text-sm opacity-70 flex items-center gap-2">
            <span>{t("stockSection.item.lowStockThreshold")}: {item.minQty}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingThreshold((prev) => !prev)}
            className="text-xs underline hover:font-bold"
          >
            {t("stockSection.item.editThreshold")}
          </button>
        </div>

        {isEditingThreshold && (
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
        )}

        <div className="my-5 h-px bg-[var(--divider)] opacity-60 sm:hidden" />

        <div className="text-center mb-5 sm:mb-0">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDelta((d) => d - 1)}
              disabled={updatingQuantity}
              title={t("stockSection.item.removeLabel")}
              aria-label={t("stockSection.item.removeLabel")}
            >
              <FiMinus className="h-4 w-4" />
            </Button>

            <span className={pillTextStyle}>{delta}</span>

            <Button
              variant="ghost"
              type="button"
              onClick={() => setDelta((d) => d + 1)}
              disabled={updatingQuantity}
              title={t("stockSection.item.addLabel")}
              aria-label={t("stockSection.item.addLabel")}
            >
              <FiPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          type="button"
          variant={delta >= 0 ? "confirm" : "danger"}
          onClick={handleConfirm}
          disabled={updatingQuantity || delta === 0}
          loading={false}
          className="w-full sm:w-2/12"
        >
          {delta >= 0 ? t("stockSection.item.confirmAdd") : t("stockSection.item.confirmRemove")}
        </Button>
      </section>

      {isEditingThreshold && (
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
      )}
    </article>
  );
}


/*

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











*/

