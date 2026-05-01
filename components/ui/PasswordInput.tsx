"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { inputBaseStyle, focusRingInset  } from "@/styles";
import type { PasswordInputProps } from "@/types/ui";

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  required = false,
  autoComplete,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      <div
        className={`relative flex items-center rounded-xl border border-default
                    bg-surface-1 ${focusRingInset}`}
      >
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={`${inputBaseStyle} border-none pr-11`}
        />

        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className={`absolute right-3 inline-flex items-center justify-center ${focusRingInset}
                      rounded-md p-1 text-muted transition hover:text-[var(--foreground)]`}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    </div>
  );
}
