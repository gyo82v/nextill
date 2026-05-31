"use client";

import { useAuth } from "@/firebase/authProvider";
import { formatMoney } from "@/lib/money";
import { FaCartShopping } from "react-icons/fa6";

type Props = {
  itemCount: number;
  totalMinor: number;
  onOpen: () => void;
};

export default function MobileCartBar({
  itemCount,
  totalMinor,
  onOpen,
}: Props) {
  const { profile } = useAuth();
  const currency = profile?.nextillApp.settings.currency ?? "EUR";

  if (itemCount === 0) return null;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open cart with ${itemCount} items`}
      className="
        fixed bottom-4 right-4 z-40 
        flex items-center gap-3
        rounded-2xl border border-default
        bg-surface-1/95 backdrop-blur
        px-4 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5
        shadow-lg shadow-black/10
        hover:shadow-xl hover:-translate-y-0.5
        active:translate-y-0 active:shadow-md
        transition-all
        lg:hidden
      "
    >
      {/* Icon + badge */}
      <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 border border-default">
        <FaCartShopping className="text-base text-muted-foreground" />

        <span
          className="
            absolute -top-1.5 -right-1.5
            inline-flex h-5 min-w-[1.25rem]
            items-center justify-center
            rounded-full
            bg-[var(--primary)]
            px-1 text-[11px] font-semibold
            text-[var(--primary-foreground)]
            shadow
          "
        >
          {itemCount}
        </span>
      </span>

      {/* Text */}
      <span className="flex flex-col text-left leading-tight">
        <span className="text-xs font-medium text-muted-foreground uppercase">
          cart
        </span>

        <span className="text-sm font-semibold tracking-tight">
          {formatMoney(totalMinor, currency)}
        </span>
      </span>
    </button>
  );
}

/*

"use client";

import { useAuth } from "@/firebase/authProvider";
import { formatMoney } from "@/lib/money";
import Button from "@/components/ui/Button";
import { FaCartShopping } from "react-icons/fa6";

type Props = {
  itemCount: number;
  totalMinor: number;
  onOpen: () => void;
};

export default function MobileCartBar({ itemCount, totalMinor, onOpen }: Props) {
  const { profile } = useAuth();
  const currency = profile?.nextillApp.settings.currency ?? "EUR";

  if (itemCount === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-surface-1/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex w-full max-w-[1800px] items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onOpen}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-default bg-surface-2 px-4 py-3 text-left shadow-sm"
          aria-label={`Open cart with ${itemCount} items`}
        >
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-default bg-surface-1 text-muted-foreground">
            <FaCartShopping className="text-sm" aria-hidden="true" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
            <span className="block text-xs text-muted-foreground">
              Tap to review the cart
            </span>
          </span>
        </button>

        <div className="shrink-0 text-right">
          <div className="text-xs text-muted-foreground">Total</div>
          <div className="text-base font-semibold tracking-tight">
            {formatMoney(totalMinor, currency)}
          </div>
        </div>

        <Button
          type="button"
          variant="confirm"
          onClick={onOpen}
          className="shrink-0 px-4 py-3"
        >
          View cart
        </Button>
      </div>
    </div>
  );
}




*/