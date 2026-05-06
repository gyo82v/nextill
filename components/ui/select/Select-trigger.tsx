"use client";

import { forwardRef } from "react";
import { HiChevronDown } from "react-icons/hi2";
import { transitions, activePress, focusRing, toggleButton } from "@/styles";
import { useSelect } from "./Select-root";

type SelectTriggerProps = {
  placeholder?: string;
  label?: string;
  className?: string;
  children?: React.ReactNode;
};

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger({ placeholder = "Select option", label, className, children }, ref) {
    const { value, open, toggleMenu, triggerRef, disabled } = useSelect();

    return (
      <button
        ref={(node) => {
          triggerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        type="button"
        disabled={disabled}
        onClick={toggleMenu}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`
          inline-flex h-11 min-w-[11rem] items-center justify-between gap-3
          rounded-xl border border-default bg-surface-2 px-4 text-sm font-medium
          text-foreground shadow-sm hover-surface-1
          ${focusRing} ${transitions} ${activePress}
          ${className ?? ""}
        `}
      >
        <span className="truncate">
          {children ?? label ?? (value || placeholder)}
        </span>

        <HiChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-muted ${toggleButton} ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
    );
  }
);

export default SelectTrigger;