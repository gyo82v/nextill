"use client";

import { HiChevronDown } from "react-icons/hi2";
import { transitions, activePress } from "@/styles/";
import { focusRing } from "@/styles/focus";
import { forwardRef } from "react";

type LanguageToggleButtonProps = {
  label: string;
  open: boolean;
  onClick: () => void;
};

const LanguageToggleButton = forwardRef<
  HTMLButtonElement,
  LanguageToggleButtonProps
>(function LanguageToggleButton({ label, open, onClick }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-haspopup="listbox"
      aria-expanded={open}
      className={`inline-flex h-11 min-w-[11rem] items-center justify-between gap-3 rounded-xl border border-default bg-surface-2 px-4 text-sm font-medium text-foreground shadow-sm hover-surface-1 ${focusRing} ${transitions} ${activePress}`}
    >
      <span className="truncate">{label}</span>

      <HiChevronDown
        aria-hidden="true"
        className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ease-out motion-reduce:transition-none ${
          open ? "rotate-180" : "rotate-0"
        }`}
      />
    </button>
  );
});

export default LanguageToggleButton;