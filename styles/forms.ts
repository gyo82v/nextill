import {focusWithinRing} from "./focus";
import {transitions} from "./patterns";

/* ======================================================
   Form container (overall wrapper)
====================================================== */
export const formContainerStyle = `
  w-full max-w-md
  space-y-6
`;

/* ======================================================
   Form section (groups fields visually)
====================================================== */
export const formSectionStyle = `
  space-y-4
`;

/* ======================================================
   Field wrapper (label + input + error/help)
====================================================== */
export const formFieldStyle = `
  space-y-1.5
`;

/* ======================================================
   Label
====================================================== */
export const formLabelStyle = `
  block text-sm font-medium text-[var(--foreground)]
`;

/* ======================================================
   Helper text (hint below inputs)
====================================================== */
export const formHelperTextStyle = `
  text-xs text-muted
`;

/* ======================================================
   Error text
====================================================== */
export const formErrorTextStyle = `
  text-xs font-medium text-red-600
`;

/* ======================================================
   Field group (input + icon, password toggle, etc.)
====================================================== */
export const formInputGroupStyle = `
  relative rounded-2xl
  ${focusWithinRing}
  ${transitions}
`;

/* ======================================================
   Actions area (submit + secondary actions)
====================================================== */
export const formActionsStyle = `
  flex flex-col gap-3 pt-2
`;

/* ======================================================
   Inline actions (links under forms)
====================================================== */
export const formInlineActionsStyle = `
  flex items-center justify-between text-sm
`;