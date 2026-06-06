"use client";

import Link from "next/link";
import AccountSectionCard from "./AccountSectionCard";

export default function PrivacyPolicySection() {
  return (
    <AccountSectionCard
      title="Privacy policy"
      description="Learn how your data is collected, used, and stored."
    >
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          The privacy policy explains what data is stored in your account, how it
          is processed, and your rights regarding your personal information.
        </p>

        <Link
          href="/privacy-policy"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          View privacy policy
        </Link>
      </div>
    </AccountSectionCard>
  );
}