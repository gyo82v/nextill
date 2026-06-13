"use client";

import type { AccountSectionCardProps } from "@/types";

export default function AccountSectionCard({
  title,
  description,
  children,
}: AccountSectionCardProps) {
  return (
    <section className="rounded-2xl border border-default bg-surface-1 p-5">
      <header className="mb-4 space-y-1">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </header>

      {children}
    </section>
  );
}