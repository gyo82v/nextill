"use client";

import CartItemRow from "./CartItemRow";
import type { CartItem } from "@/store/useCartStore";

type Props = {
  items: CartItem[];
  total: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
};

export default function CartPanel({
  items,
  total,
  onAdd,
  onRemove,
}: Props) {
  return (
    <div className="border rounded p-4 space-y-4">
      <h2 className="font-semibold">Cart</h2>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Cart is empty
        </p>
      ) : (
        items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            onAdd={() => onAdd(item.id)}
            onRemove={() => onRemove(item.id)}
          />
        ))
      )}

      <div className="pt-2 border-t font-medium">
        Total: €{total.toFixed(2)}
      </div>
    </div>
  );
}