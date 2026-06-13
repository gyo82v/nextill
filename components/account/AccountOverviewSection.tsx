"use client";

import AccountSectionCard from "./AccountSectionCard";
import { useTranslation } from "react-i18next";
import type { AccountOverviewSectionProps, Row } from "@/types";

function formatText(value?: string | null) {
  return value?.trim() ? value : "—";
}

export default function AccountOverviewSection({
  user,
  profile,
}: AccountOverviewSectionProps) {
  const {t} = useTranslation("account")

  function formatBoolean(value?: boolean | null) {
    return value ? t("overview.enabled") : t("overview.disabled");
  }
   function formatBooleanEmail(value?: boolean | null) {
    return value ? t("overview.confirmed") : t("overview.notConfirmed");
  }

  const rows:Row[] = [
    {
      label: t("overview.email"),
      value: formatText(profile?.email ?? user?.email),
    },
    {
      label: t("overview.username"),
      value: formatText(profile?.displayName),
    },
    {
      label: t("overview.dayStatus"),
      value: profile?.nextillApp?.dayCycle?.active ? t("overview.active") : t("overview.inactive"),
    },
    {
      label: t("overview.emailConfirmed"),
      value: formatBooleanEmail(user?.emailVerified),
    },
    {
      label: t("overview.receiptPrintingEnabled"),
      value: formatBoolean(profile?.nextillApp?.settings?.receiptEnabled),
    },
    {
      label: t("overview.ticketPrintingEnabled"),
      value: formatBoolean(profile?.nextillApp?.settings?.ticketEnabled),
    },
    {
      label: t("overview.balanceEnabled"),
      value: formatBoolean(profile?.nextillApp?.settings?.balanceEnabled),
    },
  ];

  return (
    <AccountSectionCard
      title={t("overview.title")}
      description={t("overview.description")}
    >
      <dl className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex flex-col gap-1 rounded-xl border border-default
                        bg-surface-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between`}
          >
            <dt className="text-sm font-medium text-muted-foreground">
              {row.label}
            </dt>
            <dd className="text-sm font-semibold text-foreground sm:text-right">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </AccountSectionCard>
  );
}
