"use client";

import { useEffect, useState } from "react";
import Select from "@/components/ui/select"

import AccountSectionCard from "@/components/account/AccountSectionCard";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/modals/Modal";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";
import { moneyToMinorUnits } from "@/lib/money";
import { inputBaseStyle } from "@/styles";
import type { Discount } from "@/types/discount";
import {
  createDiscount,
  updateDiscount,
  subscribeDiscounts,
} from "@/firebase/discount";
import { useTranslation } from "react-i18next";

type DiscountSectionProps = {
  userId: string;
  dayActive: boolean;
  discountEnabled: boolean;
};

export default function DiscountSection({
  userId,
  dayActive,
  discountEnabled,
}: DiscountSectionProps) {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [archiveTarget, setArchiveTarget] = useState<Discount | null>(null);
  const [archiveLoading, setArchiveLoading] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<"flat" | "percentage">("flat");
  const [valueInput, setValueInput] = useState("");
  const {t} = useTranslation("account")

  /* ─────────────────────────────── */
  /* SUBSCRIBE                       */
  /* ─────────────────────────────── */

  useEffect(() => {
    if (!discountEnabled) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeDiscounts(userId, (data) => {
      setDiscounts(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId, discountEnabled]);

  const activeDiscounts = discounts.filter((d) => d.active);

  /* ─────────────────────────────── */
  /* CREATE / EDIT                   */
  /* ─────────────────────────────── */

  async function handleSave() {
    if (!name.trim()) return;

    setFormLoading(true);

    try {
      if (type === "flat") {
        const valueMinor = moneyToMinorUnits(valueInput);
        if (valueMinor === null || valueMinor <= 0) return;

        if (editingDiscount) {
          await updateDiscount(userId, editingDiscount.id, {
            type: "flat",
            name: name.trim(),
            valueMinor,
          });
        } else {
          await createDiscount(userId, {
            type: "flat",
            name: name.trim(),
            valueMinor,
            active: true,
          });
        }
      } else {
        const percentage = Number(valueInput);
        if (!Number.isFinite(percentage) || percentage <= 0 || percentage > 100)
          return;

        if (editingDiscount) {
          await updateDiscount(userId, editingDiscount.id, {
            type: "percentage",
            name: name.trim(),
            percentage,
          });
        } else {
          await createDiscount(userId, {
            type: "percentage",
            name: name.trim(),
            percentage,
            active: true,
          });
        }
      }

      resetForm();
    } finally {
      setFormLoading(false);
    }
  }

  function resetForm() {
    setName("");
    setType("flat");
    setValueInput("");
    setEditingDiscount(null);
    setIsModalOpen(false);
  }

  /* ─────────────────────────────── */
  /* ARCHIVE                         */
  /* ─────────────────────────────── */

  async function handleArchive() {
    if (!archiveTarget) return;

    try {
      setArchiveLoading(true);

      await updateDiscount(userId, archiveTarget.id, {
        type: archiveTarget.type,
        active: false,
      });

      setArchiveTarget(null);
    } finally {
      setArchiveLoading(false);
    }
  }

  /* ─────────────────────────────── */
  /* RENDER                          */
  /* ─────────────────────────────── */

  return (
    <AccountSectionCard
      title={t("discount.title")}
      description={
        dayActive
          ? t("discount.descriptionEndday")
          : t("discount.description")
      }
    >
      {!discountEnabled ? (
        <p className="text-sm text-muted-foreground">
          {t("discount.disabled")}
        </p>
      ) : loading ? (
        <p className="text-sm text-muted-foreground">{t("discount.loading")}</p>
      ) : activeDiscounts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t("discount.notActive")}
        </p>
      ) : (
        <ul className="space-y-3">
          {activeDiscounts.map((discount) => (
            <li
              key={discount.id}
              className="flex items-center justify-between rounded-lg border border-default p-3"
            >
              <div>
                <p className="font-medium">{discount.name}</p>
                <p className="text-sm text-muted-foreground">
                  {discount.type === "percentage"
                    ? `${discount.percentage}%`
                    : `€${(discount.valueMinor / 100).toFixed(2)}`}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={dayActive}
                  onClick={() => {
                    setEditingDiscount(discount);
                    setName(discount.name);
                    setType(discount.type);
                    setValueInput(
                      discount.type === "flat"
                        ? String(discount.valueMinor / 100)
                        : String(discount.percentage)
                    );
                    setIsModalOpen(true);
                  }}
                >
                  {t("discount.buttonEdit")}
                </Button>

                <Button
                  variant="secondary"
                  disabled={dayActive}
                  onClick={() => setArchiveTarget(discount)}
                >
                  {t("discount.buttonArchive")}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {discountEnabled && !loading && (
        <div className="mt-4">
          <Button disabled={dayActive} onClick={() => setIsModalOpen(true)}>
            {t("discount.buttonCreate")}
          </Button>
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={resetForm}
        title={editingDiscount ? t("discount.modal.titleEdit") : t("discount.modal.titleCreate")}
        description={t("discount.modal.description")}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={resetForm}>
              {t("discount.modal.buttonCancel")}
            </Button>
            <Button onClick={handleSave} loading={formLoading}>
              {t("discount.modal.buttonSave")}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="">
            <label className="text-sm font-medium" htmlFor="name">
              {t("discount.modal.name")}
            </label>
            <input
              className={`${inputBaseStyle} mt-1`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
            />
          </div>

          <div>
  <label className="text-sm font-medium ">
    {t("discount.modal.type")}
  </label>

  <Select.Root
    value={type}
    className="w-full mt-1"
    onValueChange={(value) =>
      setType(value as "flat" | "percentage")
    }
  >
    {/* TRIGGER */}
    <Select.Trigger className="w-full">
      {type === "flat" ? t("discount.modal.select.flat") :
                         t("discount.modal.select.percentage")}
    </Select.Trigger>

    {/* CONTENT */}
    <Select.Content>
      <Select.Item value="flat">
        <div className="flex flex-col">
          <span className="font-medium">
            {t("discount.modal.select.titleFlat")}
          </span>
          <span className="text-sm text-muted-foreground">
            {t("discount.modal.select.descriptionFlat")}
          </span>
        </div>
      </Select.Item>

      <Select.Item value="percentage">
        <div className="flex flex-col">
          <span className="font-medium">
            {t("discount.modal.select.titlePercentage")}
          </span>
          <span className="text-sm text-muted-foreground">
            {t("discount.modal.select.descriptionPercentage")}
          </span>
        </div>
      </Select.Item>
    </Select.Content>
  </Select.Root>
</div>

          <div>
            <label className="text-sm font-medium" htmlFor="amount">
              {type === "percentage" ? t("discount.modal.labelPercentage") :
                                       t("discount.modal.labelFlat")}
            </label>
            <input
              className={`${inputBaseStyle} mt-1`}
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              inputMode="decimal"
              id="amount"
            />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleArchive}
        loading={archiveLoading}
        title={t("discount.archiveModal.title")}
        description={t("discount.archiveModal.description")}
        confirmLabel={t("discount.archiveModal.confirmButton")}
        danger
      />
    </AccountSectionCard>
  );
}
