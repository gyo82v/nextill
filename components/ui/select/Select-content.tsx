"use client";

import { modalPanel } from "@/styles";
import { useSelect } from "./Select-root";
import type { SelectContentProps } from "@/types/select";

export default function SelectContent({
  children,
  className,
  "aria-label": ariaLabel = "Select options",
}: SelectContentProps) {
  const { open } = useSelect();

  return (
    <div
      role="listbox"
      aria-label={ariaLabel}
      aria-hidden={!open}
      className={`
        absolute left-0 top-full z-50 mt-2 w-full overflow-hidden
        rounded-xl border border-default bg-surface-1 p-2 shadow-lg
        ${modalPanel} origin-top-left
        ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-95 opacity-0"
        }
        ${className ?? ""}
      `}
    >
      {children}
    </div>
  );
}
