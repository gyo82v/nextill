import React from "react";
import type { DividerProps, DotLineDividerProps, IconDividerProps } from "@/types";

export function SimpleDivider({className}: DividerProps) {
  return <hr aria-hidden="true" className={`my-4 h-px w-full border-0 bg-slate-200 ${className}`}/>;
}

export function SectionDivider({className}: DividerProps) {
  return <hr aria-hidden="true" className={`my-8 h-px w-full border-0 bg-slate-300 ${className}`}/>;
}

export function GradientDivider({className}: DividerProps) {
  return (
    <hr
      aria-hidden="true"
      className={`my-6 h-[2px] w-full border-0 bg-gradient-to-r 
                  from-transparent via-slate-300 to-transparent ${className}`}
    />
  );
}

export function DotLineDivider({ className, dotClassName, lineClassName }: DotLineDividerProps) {
  return (
    <div aria-hidden="true" className={`my-6 flex w-full items-center ${className}`}>
      <span className={`h-px flex-1 bg-slate-200 ${lineClassName}`} />
      <span className={`h-2 w-2 rounded-full bg-slate-400 ${dotClassName}`} />
      <span className={`h-px flex-1 bg-slate-200 ${lineClassName}`} />
    </div>
  );
}

export function IconDivider({ icon, className = "" }: IconDividerProps) {
  return (
    <div
      className={`my-6 flex w-full items-center gap-3 ${className}`}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-slate-200" />

      {icon && (
        <span className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-500 shadow-sm">
          {icon}
        </span>
      )}

      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

export function Divider({variant = "item"}: {variant: "section" | "item"}) {
  const isSection = variant === "section";

  if (isSection) {
    return (
      <div
        aria-hidden="true"
        className={`my-14 w-full`}
      >
        <div className="h-px w-full bg-slate-300 dark:bg-slate-600" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`my-12 flex w-full items-center justify-center`}
    >
      <div className="h-px w-12 bg-slate-200 dark:bg-slate-700" />
      <span className="mx-3 h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
      <div className="h-px w-12 bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

export function IconSeparator({ icon, className = "", }: IconDividerProps) {
  return (
    <div
      className={`flex items-center my-4 ${className}`}
      aria-hidden="true"
    >
      <div className="flex-1 h-px bg-slate-600/70" />

      {icon && (
        <span className="mx-3 text-slate-400 flex items-center justify-center">
          {icon}
        </span>
      )}

      <div className="flex-1 h-px bg-slate-600/70" />
    </div>
  );
}

export function GradientLine({ className = "" }: { className?: string }) {
  return (
    <div className={`my-6 ${className}`} aria-hidden="true">
      <div className="h-0.5 w-full bg-gradient-to-r from-slate-300/80 via-slate-200/60 to-slate-300/80" />
    </div>
  );
}


