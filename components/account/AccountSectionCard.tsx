"use client";

import type { ReactNode } from "react";

type AccountSectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

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