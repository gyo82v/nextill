"use client";

import Button from "../ui/Button";
import TransactionCard from "./TransactionCard";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import type { CurrentDayTransactionsProps } from "@/types";

export default function CurrentDayTransactions({
  transactions,
  currency,
  isOpen,
  onToggle,
}: CurrentDayTransactionsProps) {
  const {t} = useTranslation("reports")
  return (
    <section className="w-full">
      <div className="mb-8 min-h-[88px] flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {t("currentDayTransactions.title")}
          </h2>
          <p className="mt-2 max-w-[80%] text-sm text-muted-foreground">
            {t("currentDayTransactions.description")}
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={onToggle}
          className="flex items-center gap-2"
        >
          {isOpen ? (
            <>
              <FiEyeOff className="text-base" />
              <span> {t("currentDayTransactions.hide")}</span>
            </>
          ) : (
            <>
              <FiEye className="text-base" />
              <span> {t("currentDayTransactions.show")}</span>
            </>
          )}
        </Button>
      </div>

      <div>
        {isOpen ? (
          transactions.length > 0 ? (
            <div className="max-h-[500px] space-y-3 overflow-y-auto pr-2">
              {transactions.map((tx) => (
                <TransactionCard
                  key={tx.id}
                  transaction={tx}
                  currency={currency}/>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
               {t("currentDayTransactions.emptyState")}
            </p>
          )
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("currentDayTransactions.hiddenState")}
          </p>
        )}
      </div>
    </section>
  );
}
