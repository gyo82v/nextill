"use client";

import Link from "next/link";
import AccountSectionCard from "./AccountSectionCard";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicySection() {
  const {t} = useTranslation("account")
  return (
    <AccountSectionCard
      title={t("privacy.title")}
      description={t("privacy.description")}
    >
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {t("privacy.paragraph")}
        </p>

        <Link
          href="/privacy-policy"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          {t("privacy.linkText")}
        </Link>
      </div>
    </AccountSectionCard>
  );
}