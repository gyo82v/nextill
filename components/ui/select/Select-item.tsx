"use client";

import { forwardRef } from "react";
import { HiCheck } from "react-icons/hi2";
import { activePress, transitions, overlay, focusRing } from "@/styles";
import { useSelect } from "./Select-root";

type SelectItemProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

const SelectItem = forwardRef<HTMLButtonElement, SelectItemProps>(
  function SelectItem({ value, children, className }, ref) {
    const { value: selectedValue, onValueChange, closeMenu, triggerRef } = useSelect();
    const selected = selectedValue === value;

    function handleSelect() {
      onValueChange(value);
      closeMenu();
      triggerRef.current?.focus();
    }

    return (
      <button
        ref={ref}
        type="button"
        role="option"
        aria-selected={selected}
        onClick={handleSelect}
        className={`
          flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-foreground
          ${selected ? "bg-surface-2 font-medium" : "bg-transparent"}
          hover-surface-2 ${focusRing} ${transitions} ${activePress}
          ${className ?? ""}
        `}
      >
        <span className="truncate">{children}</span>

        <HiCheck
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-primary ${overlay} ${selected ? "opacity-100" : "opacity-0"}`}
        />
      </button>
    );
  }
);

SelectItem.displayName = "SelectItem";

export default SelectItem;