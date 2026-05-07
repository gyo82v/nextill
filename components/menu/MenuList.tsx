"use client";

import type { MenuListProps } from "@/types/menu";
import MenuItem from "./MenuItem";
import { useTranslation } from "react-i18next";

export default function MenuList({
  loading,
  menuItems,
  stockItems,
  currency,
  loadingDelete,
  onDelete,
}: MenuListProps) {
  const { t } = useTranslation("menu");
  return (
    <div className="space-y-3">

      {loading ? (
        <p className="opacity-70">{t("listSection.loading")}</p>
      ) : menuItems.length === 0 ? (
        <p className="opacity-70">{t("listSection.emptyState")}</p>
      ) : (
        <div className="space-y-3">
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              stockItems={stockItems}
              currency={currency}
              loading={loadingDelete}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}