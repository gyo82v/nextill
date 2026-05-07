"use client";

import { forwardRef } from "react";
import { HiChevronDown } from "react-icons/hi2";
import { activePress, toggleButton, inputBaseStyle } from "@/styles";
import { useSelect } from "./Select-root";
import type { SelectTriggerProps } from "@/types/select";

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
          inline-flex items-center justify-between px-4 
          ${inputBaseStyle} ${activePress} 
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
