"use client";

import type { SwitchProps } from "@/types";
import { focusRing, transitions } from "@/styles";

export default function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  className = "",
  ...ariaProps
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaProps["aria-label"]}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => {
        if (!disabled) onCheckedChange(!checked);
      }}
      className={`
        relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border p-0.5
        ${transitions}
        ${focusRing}
        ${
          checked
            ? "bg-[var(--primary)] border-[var(--primary-hover)]"
            : "bg-slate-300 border-slate-400 dark:bg-slate-600 dark:border-slate-500"
        }
        ${
          disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:border-[var(--primary-hover)]"
        }
        ${className}
      `}
    >
      <span
        className={`
          pointer-events-none absolute left-0.5 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border shadow-sm
          ${transitions}
          ${
            checked
              ? "translate-x-5 bg-slate-100 border-slate-100"
              : "translate-x-0 bg-white border-slate-400 dark:bg-slate-200 dark:border-slate-300"
          }
        `}
      />
    </button>
  );
}

/*

"use client";

import type { SwitchProps } from "@/types";

export default function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  className = "",
  ...ariaProps
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaProps["aria-label"]}
      disabled={disabled}
      onClick={() => {
        if (!disabled) onCheckedChange(!checked);
      }}
      className={[
        "relative inline-flex h-7 w-12 items-center rounded-full border border-default transition",
        "focus-visible:outline-none",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className,
      ].join(" ")}
      style={{
        backgroundColor: checked ? "var(--primary)" : "var(--surface-2)",
      }}
    >
      <span
        className="absolute left-1 h-5 w-5 rounded-full bg-surface-1 transition-transform"
        style={{
          transform: checked ? "translateX(20px)" : "translateX(0px)",
        }}
      />
    </button>
  );
}



*/