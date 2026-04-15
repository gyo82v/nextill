"use client";

import type { CartItem } from "@/types";
import { formatMoney } from "@/lib/money";
import { useAuth } from "@/firebase/authProvider";

type Props = {
  item: CartItem;
  onAdd: () => void;
  onRemove: () => void;
};

export default function CartItemRow({item, onAdd, onRemove}: Props) {
  const { profile } = useAuth();
  const currency = profile?.nextillApp.settings.currency ?? "EUR";
  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="font-medium">{item.name}</div>
        <div className="text-sm text-muted-foreground">
          {item.quantity} × {formatMoney(item.priceMinor, currency)}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onRemove} className="px-2 border rounded">
          −
        </button>
        <button onClick={onAdd} className="px-2 border rounded">
          +
        </button>
      </div>
    </div>
  );
}
