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
} from "@/styles";
import type { ButtonProps, ButtonVariant } from "@/types";   

const variantStyles: Record<ButtonVariant, string> = {
  primary: buttonPrimaryStyle,
  secondary: buttonSecondaryStyle,
  ghost: buttonGhostStyle,
  danger: buttonDangerStyle,
  icon: buttonIconStyle,
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
        className={`${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {loading ? (
          <>
            <Spinner className="h-4 w-4" />
            <span>{loadingText ?? children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;