import type { ReactNode } from "react";

export type SelectContextValue = {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
};

export type SelectRootProps<T extends string = string> = {
  value: T;
  onValueChange: (value: T) => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export type SelectTriggerProps = {
  placeholder?: string;
  label?: string;
  className?: string;
  children?: React.ReactNode;
};

export type SelectContentProps = {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
};

export type SelectItemProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

