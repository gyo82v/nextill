"use client";

import React from "react";
import { Spinner } from "./spinners/Spinners";
import {
  buttonPrimaryStyle,
  buttonSecondaryStyle,
  buttonGhostStyle,
  buttonDangerStyle,
  buttonIconStyle,
  buttonSmallStyle,
  buttonConfirmStyle,
  buttonPrimaryDangerStyle
} from "@/styles";
import type { ButtonProps, ButtonVariant } from "@/types";

const variantStyles: Record<ButtonVariant, string> = {
  primary: buttonPrimaryStyle,
  secondary: buttonSecondaryStyle,
  ghost: buttonGhostStyle,
  danger: buttonDangerStyle,
  icon: buttonIconStyle,
  confirm: buttonConfirmStyle,
  primaryDanger: buttonPrimaryDangerStyle
};

const sizeStyles: Record<"default" | "small", string> = {
  default: "",
  small: buttonSmallStyle,
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "default",
      loading = false,
      loadingText,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={[
          variantStyles[variant],
          sizeStyles[size],
          "relative inline-flex items-center justify-center whitespace-nowrap",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <span
          className={[
            "inline-flex items-center justify-center gap-1",
            loading ? "invisible" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </span>

        {loading && (
          <span className="absolute inset-0 flex items-center justify-center gap-2">
            <Spinner className="h-4 w-4 shrink-0" />
            {loadingText ? <span>{loadingText}</span> : null}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

