import {transitions} from "./patterns";
import {focusRing} from "./focus";

export const inputBaseStyle = `
  w-full rounded-2xl border border-default bg-surface-1 px-4 py-3
  text-[var(--foreground)] placeholder:text-muted-foreground
  shadow-sm outline-none
  ${transitions}
  ${focusRing}
`;

export const inputCompactStyle = `
  w-full rounded-xl border border-default bg-surface-1 px-3 py-2
  text-sm text-[var(--foreground)] placeholder:text-muted-foreground
  shadow-sm outline-none
  ${transitions}
  ${focusRing}
`;

export const textareaStyle = `
  w-full min-h-32 resize-y rounded-2xl border border-default bg-surface-1 px-4 py-3
  text-[var(--foreground)] placeholder:text-muted-foreground
  shadow-sm outline-none
  ${transitions}
  ${focusRing}
`;

export const selectStyle = `
  w-full rounded-2xl border border-default bg-surface-1 px-4 py-3
  text-[var(--foreground)] outline-none
  shadow-sm
  ${transitions}
  ${focusRing}
`;

export const inputErrorStyle = `
  border-red-500 focus-visible:ring-red-500
`;

export const inputDisabledStyle = `
  cursor-not-allowed opacity-60
`;