"use client";

import Drawer from "@/components/ui/drawers/Drawer";
import CartPanel from "./CartPanel";
import CheckoutButton from "./CheckoutButton";
import type {MobileCartDrawerProps} from "@/types/pos";
import { FiX } from "react-icons/fi";
import { iconsBtn } from "@/styles";
import { useTranslation } from "react-i18next";

export default function MobileCartDrawer({
  open,
  onClose,
  items,
  checkoutItems,
  totalMinor,
  onAdd,
  onRemove,
  onSuccess,
}: MobileCartDrawerProps) {
  const { t } = useTranslation("pos");
  const handleClose = () => {
    if (typeof document !== "undefined") {
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement) {
        activeElement.blur();
      }
    }

    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      side="bottom"
      panelClassName="max-h-[88dvh]"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-default px-4 py-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{t("mobile.cartTitle")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("mobile.cartDescription")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label={t("mobile.closeCartAriaLabel")}
            title={t("mobile.closeCartTitle")}
            className={iconsBtn}
          >
            <FiX className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <CartPanel
            items={items}
            totalMinor={totalMinor}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        </div>

        <footer className="border-t border-default bg-surface-1 px-4 py-4">
          <CheckoutButton
            items={checkoutItems}
            totalMinor={totalMinor}
            onSuccess={onSuccess}
          />
        </footer>
      </div>
    </Drawer>
  );
}
