"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import type { DaySummary, DaySummaryRow } from "@/types";
import Button from "../ui/Button";
import DailyOverviewCard from "./DailyOverviewCard";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import type { ReportsDailyOverviewProps } from "@/types";

export default function ReportsDayOverview({
  userId,
  currency,
  menuItems,
  isOpen,
  onToggle,
}: ReportsDailyOverviewProps) {
  const [loading, setLoading] = useState(true);
  const [dailySummaries, setDailySummaries] = useState<DaySummaryRow[]>([]);
  const { t } = useTranslation("reports");

  useEffect(() => {
    if (!userId) {
      queueMicrotask(() => {
        setDailySummaries([]);
        setLoading(false);
      });
      return;
    }

    queueMicrotask(() => {
      setLoading(true);
    });

    const summariesRef = query(
      collection(db, "users", userId, "dailySummaries"),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(
      summariesRef,
      (snap) => {
        setDailySummaries(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as DaySummary),
          }))
        );
        setLoading(false);
      },
      () => {
        setDailySummaries([]);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  const menuNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of menuItems) {
      map.set(item.id, item.name);
    }
    return map;
  }, [menuItems]);

  return (
    <section className="w-full">
      <div className="mb-8 min-h-[88px] flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {t("dailyOverview.title")}
          </h2>
          <p className="mt-2 max-w-[80%] text-sm text-muted-foreground">
            {t("dailyOverview.description")}
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={onToggle}
          className="flex items-center gap-2"
        >
          {isOpen ? (
            <>
              <FiEyeOff className="text-base" />
              <span>{t("dailyOverview.hide")}</span>
            </>
          ) : (
            <>
              <FiEye className="text-base" />
              <span>{t("dailyOverview.show")}</span>
            </>
          )}
        </Button>
      </div>

      <div>
        {loading ? (
          <p className="text-sm text-muted-foreground">
            {t("dailyOverview.loading")}
          </p>
        ) : isOpen ? (
          dailySummaries.length > 0 ? (
            <div className="max-h-[500px] space-y-3 overflow-y-auto pr-2">
              {dailySummaries.map((day, index) => (
                <DailyOverviewCard
                  key={day.id}
                  day={day}
                  currency={currency}
                  previousEarnings={dailySummaries[index + 1]?.earnings}
                  mostSoldName={
                    day.mostSoldItem
                      ? menuNameById.get(day.mostSoldItem) ?? day.mostSoldItem
                      : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("dailyOverview.emptyState")}
            </p>
          )
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("dailyOverview.hiddenState")}
          </p>
        )}
      </div>
    </section>
  );
}
