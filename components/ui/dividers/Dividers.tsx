import type { DividerProps, DotLineDividerProps } from "@/types";

export function DotLineDivider({ className, dotClassName, lineClassName }: DotLineDividerProps) {
  return (
    <div aria-hidden="true" className={`my-6 flex w-full items-center ${className}`}>
      <span className={`h-px flex-1 bg-slate-200 ${lineClassName}`} />
      <span className={`h-2 w-2 rounded-full bg-slate-400 ${dotClassName}`} />
      <span className={`h-px flex-1 bg-slate-200 ${lineClassName}`} />
    </div>
  );
}

export function GradientDivider({ className = "" }: { className?: string }) {
  return (
    <div className={` ${className}`} aria-hidden="true">
      <div className="h-0.5 w-full border-0 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
    </div>
  );
}

export function FooterDivider() {
  return (
     <div
      aria-hidden="true"
      className={`h-px w-[60%] mx-auto bg-[color:var(--divider)] 
                  md:h-auto md:w-px my-4 md:my-0`}
    />
  )
}
 
export function MenuSectionDivider({ className = "" }: DividerProps) {
  return (
    <div
      aria-hidden="true"
      className={`
        my-8 h-px w-full bg-slate-300

        lg:my-0
        lg:absolute
        lg:top-0
        lg:bottom-0
        lg:left-1/2
        lg:w-px
        lg:h-auto
        lg:-translate-x-1/2

        ${className}
      `}
    />
  );
}

export function MobileDivider({ className = "" }: DividerProps) {
  return (
    <div className={`lg:hidden my-4 px-4 ${className}`}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--divider)] to-transparent opacity-80" />
    </div>
  );
}

export function SmallDivider({ className = "" }: DividerProps) {
  return (
    <div className={`my-4 px-4 ${className}`}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--divider)] to-transparent opacity-80" />
    </div>
  );
}


