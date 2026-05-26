"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/firebase/authProvider";
import { listMenuItems } from "@/firebase/menu";
import type {MenuItem} from "@/types"
import ReportsGlobal from "@/components/reports/ReportsGlobal";
import ReportsCurrentDay from "@/components/reports/ReportsCurrentDay";
import { DotLineDivider } from "@/components/ui/dividers/Dividers";
import ReportsDailyOverview from "@/components/reports/ReportsDailyOverview";
import { useTranslation } from "react-i18next";

export default function StatisticsPage() {
  const { user, profile } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);

  const dayKey = profile?.nextillApp?.dayCycle?.dayKey ?? null;
  const currency = profile?.nextillApp?.settings?.currency ?? "EUR";
  const {t} = useTranslation("reports")

  useEffect(() => {
    let active = true;

    async function loadMenuItems() {
      if (!user) {
        if (active) {
          setMenuItems([]);
          setMenuLoading(false);
        }
        return;
      }

      setMenuLoading(true);

      try {
        const items = await listMenuItems(user.uid);
        if (active) {
          setMenuItems(items);
        }
      } finally {
        if (active) {
          setMenuLoading(false);
        }
      }
    }

    loadMenuItems();

    return () => {
      active = false;
    };
  }, [user]);

  if (!user) return null;
  if (menuLoading) return <div className="p-6 opacity-70">{t("loading")}</div>;

  return (
    <div className="p-6 space-y-10 w-full px-4 py-14 sm:px-6 lg:px-8 lg:py-16 ">
      <ReportsGlobal
        userId={user.uid}
        currency={currency}
        menuItems={menuItems}
      />

      <DotLineDivider className="my-14 hidden lg:flex" />

      <ReportsCurrentDay
        userId={user.uid}
        dayKey={dayKey}
        currency={currency}
        menuItems={menuItems}
      />

      <DotLineDivider className="my-14 hidden lg:flex" />

      <ReportsDailyOverview
        userId={user.uid}
        dayKey={dayKey}
        currency={currency}
        menuItems={menuItems}
      />
    </div>
  );
}
