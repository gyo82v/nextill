"use client";

import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { FaXmark } from "react-icons/fa6";
import Button from "../Button";
import { overlay, modalPanel } from "@/styles";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
};

const sizeStyles: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center p-4 ${overlay}`}
      role="presentation"
      onMouseDown={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        onMouseDown={(event) => event.stopPropagation()}
        className={`relative w-full ${sizeStyles[size]} ${modalPanel} rounded-3xl border border-default bg-surface-1 p-4 shadow-2xl sm:p-6`}
      >
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 id={titleId} className="text-lg font-semibold tracking-tight">
              {title}
            </h2>

            {description ? (
              <p
                id={descriptionId}
                className="text-sm text-muted-foreground"
              >
                {description}
              </p>
            ) : null}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="small"
            onClick={onClose}
            aria-label="Close modal"
            className="h-9 w-9 px-0 py-0"
          >
            <FaXmark className="text-base" aria-hidden="true" />
          </Button>
        </header>

        <div className="mt-5">{children}</div>

        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>,
    document.body
  );
}