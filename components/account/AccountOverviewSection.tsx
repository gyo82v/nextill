"use client";

import type { User } from "firebase/auth";
import AccountSectionCard from "./AccountSectionCard";

type AccountOverviewSectionProps = {
  user: Pick<User, "email" | "emailVerified"> | null;
  profile: {
    email?: string | null;
    displayName?: string | null;
    nextillApp?: {
      dayCycle?: {
        active?: boolean | null;
      } | null;
      settings?: {
        printingEnabled?: boolean | null;
        balanceEnabled?: boolean | null;
      } | null;
    } | null;
  } | null;
};

function formatBoolean(value?: boolean | null) {
  return value ? "Yes" : "No";
}

function formatText(value?: string | null) {
  return value?.trim() ? value : "—";
}

type Row = {
  label: string;
  value: string;
};

export default function AccountOverviewSection({
  user,
  profile,
}: AccountOverviewSectionProps) {
  const rows: Row[] = [
    {
      label: "Email",
      value: formatText(profile?.email ?? user?.email),
    },
    {
      label: "Username",
      value: formatText(profile?.displayName),
    },
    {
      label: "Day status",
      value: profile?.nextillApp?.dayCycle?.active ? "Active" : "Inactive",
    },
    {
      label: "Email confirmed",
      value: formatBoolean(user?.emailVerified),
    },
    {
      label: "Printing enabled",
      value: formatBoolean(profile?.nextillApp?.settings?.printingEnabled),
    },
    {
      label: "Balance enabled",
      value: formatBoolean(profile?.nextillApp?.settings?.balanceEnabled),
    },
  ];

  return (
    <AccountSectionCard
      title="Profile"
      description="Read-only recap of your account and system settings."
    >
      <dl className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-1 rounded-xl border border-default bg-surface-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
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
