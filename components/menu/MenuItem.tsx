"use client";

import { FiTrash2 } from "react-icons/fi";
import { formatMoney } from "@/lib/money";
import { cardBaseStyle } from "@/styles/cards";
import Button from "../ui/Button";
import type {MenuItemProps} from "@/types/menu";
import { useTranslation } from "react-i18next";

export default function MenuItem({
  item,
  stockItems,
  currency,
  loading,
  onDelete,
}: MenuItemProps) {
  const { t } = useTranslation("menu");
  return (
    <div className={`${cardBaseStyle} p-4 md:p-5`}>
      <div className="flex flex-row gap-3 items-start justify-between">
        <div className="min-w-0">
          <div className="font-medium text-[var(--foreground)]">{item.name}</div>
          <div className="mt-1 text-sm text-muted">
            {formatMoney(item.priceMinor, currency)} · {t(`createSection.form.categories.${item.category}`)}
          </div>
        </div>

       <Button
         variant="danger"
         type="button"
         onClick={() => onDelete(item.id)}
         loading={loading}
         title={t("listSection.deleteItem", { name: item.name })}
         aria-label={t("listSection.deleteItem", { name: item.name })}
        >
         <FiTrash2 className="h-4 w-4" />
       </Button>
      </div>

      <div className="my-4 h-px bg-[var(--divider)] opacity-60" />

      {item.ingredients.length > 0 ? (
        <div className="text-sm text-muted">
          <span className="font-medium text-[var(--foreground)]">{t("listSection.ingredientsLabel")}:</span>{" "}
          {item.ingredients
            .map((ing) => {
              const stock = stockItems.find((s) => s.id === ing.stockId);
              return t("listSection.ingredientItem", {
                        name: stock?.name ?? ing.stockId,
                        quantity: ing.quantity
                      });
            })
            .join(", ")}
        </div>
      ) : (
        <div className="text-sm text-muted">{t("listSection.noIngredients")}</div>
      )}
    </div>
  );
}