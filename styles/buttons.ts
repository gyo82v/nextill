import { focusRing } from "./focus"
import { transitions, activePress, hoverPrimary, hoverDanger } from "./patterns"

export const iconsBtn = `inline-flex h-11 w-11 items-center justify-center rounded-xl
                         bg-surface-2 text-muted border border-default shadow-sm
                         hover-surface-1
                         ${focusRing} ${transitions} ${activePress}`


/* ======================================================
   Base button (do NOT use alone)
====================================================== */
export const buttonBaseStyle = `
  inline-flex items-center justify-center gap-1
  rounded-2xl px-4 py-3
  text-sm font-medium
  outline-none
  disabled:pointer-events-none disabled:opacity-50
  ${transitions}
  ${activePress}
  ${focusRing}
`;

/* ======================================================
   Primary button (main actions, form submit)
====================================================== */
export const buttonPrimaryStyle = `
  ${buttonBaseStyle}
  bg-[var(--primary)] text-[var(--primary-foreground)]
  ${hoverPrimary}
`;

/* ======================================================
   Secondary button (less prominent actions)
====================================================== */
export const buttonSecondaryStyle = `
  ${buttonBaseStyle}
  border border-default bg-surface-2 text-[var(--foreground)]
  hover:bg-slate-300 dark:hover:bg-slate-600
`;

/* ======================================================
   Ghost button (navigation, cancel, subtle actions)
====================================================== */
export const buttonGhostStyle = `
  ${buttonBaseStyle}
  bg-transparent text-[var(--foreground)]
  hover:bg-surface-2
`;

/* ======================================================
   Danger button (delete, destructive actions)
====================================================== */
export const buttonDangerStyle = `
  ${buttonBaseStyle}
  border border-default bg-surface-2 text-[var(--foreground)]
  ${hoverDanger}
`;

/* ======================================================
   Size variants
====================================================== */
export const buttonSmallStyle = `
  px-3 py-2 text-xs rounded-xl
`;

export const buttonIconStyle = `
  p-2 rounded-xl
`;