"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/money";
import { cardBaseStyle } from "@/styles";
import Button from "../ui/Button";
import type { TransactionRow } from "@/types";

type CurrentDayTransactionsProps = {
  transactions: TransactionRow[];
  currency: string;
};

export default function CurrentDayTransactions({
  transactions,
  currency,
}: CurrentDayTransactionsProps) {
  const [showCurrentDayTransactions, setShowCurrentDayTransactions] =
    useState(false);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex items-center justify-between mb-10 sm:mb-6 lg:mb-10 ">
        <div >
          <h2 className="text-2xl font-semibold tracking-tight">Current day transactions</h2>
          <p className="mt-1 text-sm text-muted xl:max-w-[80%]">description here</p>
        </div>

        <Button
          type="button"
          onClick={() => setShowCurrentDayTransactions((prev) => !prev)}
          variant="secondary"
        >
          {showCurrentDayTransactions ? "Hide" : "Show"}
        </Button>
      </div>

      <div className="">
        {showCurrentDayTransactions ? (
          transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className={`${cardBaseStyle} space-y-3 rounded-2xl p-4`}
                >
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-sm text-muted-foreground">
                        Transaction ID
                      </div>
                      <div className="break-all font-medium text-foreground">
                        {tx.id}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Total</div>
                      <div className="font-medium text-foreground">
                        {formatMoney(tx.totalMinor, currency)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No transactions for the current day.
            </p>
          )
        ) : (
          <p className="text-sm text-muted-foreground">Transactions hidden.</p>
        )}
      </div>
    </div>
  );
}