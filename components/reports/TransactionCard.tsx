"use client";

import { formatMoney } from "@/lib/money";
import { cardBaseStyle } from "@/styles";
import type { TransactionRow } from "@/types";

type TransactionCardProps = {
  transaction: TransactionRow;
  currency: string;
};

export default function TransactionCard({
  transaction,
  currency,
}: TransactionCardProps) {
  return (
    <div
      className={`${cardBaseStyle} rounded-2xl border border-default bg-surface-1 p-4 shadow-sm`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Transaction ID
          </div>
          <div className="mt-1 break-all text-sm font-semibold text-foreground">
            {transaction.id}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Total
          </div>
          <div className="mt-1 text-sm font-semibold text-foreground">
            {formatMoney(transaction.totalMinor, currency)}
          </div>
        </div>
      </div>
    </div>
  );
}