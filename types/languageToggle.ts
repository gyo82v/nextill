import type { LanguageCode } from "@/i18n/languages";
import type { ReactNode } from "react";

export type LanguageOptionProps = {
  label: string;
  code: LanguageCode;
  selected: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onSelect: (code: LanguageCode) => void;
};

export type LanguageOptionsPanelProps = {
  open: boolean;
  children: ReactNode;
};

export type LanguageToggleButtonProps = {
  label: string;
  open: boolean;
  onClick: () => void;
};