import React from "react";

export type DividerProps = React.HTMLAttributes<HTMLHRElement> & {
  className?: string;
};

export type DotLineDividerProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  dotClassName?: string;
  lineClassName?: string;
};

export type IconDividerProps = {
  icon?: React.ReactNode;
  className?: string;
};

export type PasswordInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
};

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "icon";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
  loadingText?: string;
  size?: "default" | "small";
};