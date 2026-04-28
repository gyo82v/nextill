"use client";

import { forwardRef } from "react";
import { HiCheck } from "react-icons/hi2";
import { activePress, transitions, overlay, focusRing } from "@/styles";
import type { LanguageOptionProps } from "@/types";

const LanguageOption = forwardRef<HTMLButtonElement, LanguageOptionProps>(
  function LanguageOption({ label, code, selected, onSelect, onKeyDown }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        role="option"
        aria-selected={selected}
        onKeyDown={onKeyDown}
        onClick={() => onSelect(code)}
        className={`flex w-full items-center justify-between rounded-lg 
                    px-3 py-2 text-left text-sm text-foreground 
                    ${ selected ? "bg-surface-2 font-medium" : "bg-transparent"}
                    hover-surface-2 ${focusRing} ${transitions} ${activePress}`}
      >
        <span className="truncate">{label}</span>

        <HiCheck
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-primary ${overlay}
                      ${selected ? "opacity-100" : "opacity-0"}`
                    }
        />
      </button>
    );
  }
);

LanguageOption.displayName = "LanguageOption";

export default LanguageOption;