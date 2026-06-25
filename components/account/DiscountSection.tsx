"use client";

import { useEffect, useState } from "react";

import AccountSectionCard from "@/components/account/AccountSectionCard";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/modals/Modal";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";
import { moneyToMinorUnits } from "@/lib/money";

import type { Discount } from "@/types/discount";
import {
  createDiscount,
  updateDiscount,
  subscribeDiscounts,
} from "@/firebase/discount";

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
      title="Discounts"
      description={
        dayActive
          ? "End the day before managing the discounts"
          : "Manage the discounts available at checkout"
      }
    >
      {!discountEnabled ? (
        <p className="text-sm text-muted-foreground">
          Discounts are currently disabled.
        </p>
      ) : loading ? (
        <p className="text-sm text-muted-foreground">Loading discounts…</p>
      ) : activeDiscounts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No active discounts available.
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
                  Edit
                </Button>

                <Button
                  variant="secondary"
                  disabled={dayActive}
                  onClick={() => setArchiveTarget(discount)}
                >
                  Archive
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {discountEnabled && !loading && (
        <div className="mt-4">
          <Button disabled={dayActive} onClick={() => setIsModalOpen(true)}>
            Create discount
          </Button>
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={resetForm}
        title={editingDiscount ? "Edit discount" : "Create discount"}
        description="Create a discount that can be applied at checkout"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={formLoading}>
              Save
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              className="mt-1 w-full rounded-md border p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Type</label>
            <select
              className="mt-1 w-full rounded-md border p-2"
              value={type}
              onChange={(e) =>
                setType(e.target.value as "flat" | "percentage")
              }
            >
              <option value="flat">Fixed amount</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">
              {type === "percentage" ? "Percentage (%)" : "Amount (€)"}
            </label>
            <input
              className="mt-1 w-full rounded-md border p-2"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              inputMode="decimal"
            />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleArchive}
        loading={archiveLoading}
        title="Archive discount"
        description="This discount will no longer be available at checkout."
        confirmLabel="Archive"
        danger
      />
    </AccountSectionCard>
  );
}