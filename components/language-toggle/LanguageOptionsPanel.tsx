"use client";

import type { ReactNode } from "react";

type LanguageOptionsPanelProps = {
  open: boolean;
  children: ReactNode;
};

export default function LanguageOptionsPanel({
  open,
  children,
}: LanguageOptionsPanelProps) {
  return (
    <div
      role="listbox"
      aria-label="Language options"
      aria-hidden={!open}
      className={[
        "absolute left-0 top-full z-50 mt-2 min-w-[11rem] overflow-hidden rounded-xl border border-default bg-surface-1 p-2 shadow-lg",
        "origin-top-left",
        "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none",
        open
          ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
          : "pointer-events-none -translate-y-1 scale-95 opacity-0",
      ].join(" ")}
    >
      {children}
    </div>
  );
}