"use client";

import type { LanguageOptionsPanelProps } from "@/types";
import { modalPanel } from "@/styles";

export default function LanguageOptionsPanel({open, children}: LanguageOptionsPanelProps) {
  return (
    <div
      role="listbox"
      aria-label="Language options"
      aria-hidden={!open}
      className={`absolute left-0 top-full z-50 mt-2 min-w-[11rem] overflow-hidden
                  rounded-xl border border-default bg-surface-1 p-2 shadow-lg
                  ${modalPanel} origin-top-left
                  ${open ? `pointer-events-auto translate-y-0 scale-100 opacity-100` : 
                           `pointer-events-none -translate-y-1 scale-95 opacity-0`} 
                `}
    >
      {children}
    </div>
  );
}