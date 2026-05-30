"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type DrawerSide = "right" | "left" | "bottom" | "top";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  children: React.ReactNode;
  overlayClassName?: string;
  panelClassName?: string;
};

const DURATION_MS = 300;

const sideStyles: Record<DrawerSide, string> = {
  right:
    "absolute right-0 top-0 h-dvh w-[min(88vw,22rem)] border-l border-default",
  left:
    "absolute left-0 top-0 h-dvh w-[min(88vw,22rem)] border-r border-default",
  bottom:
    "absolute bottom-0 left-0 w-full max-h-[90dvh] rounded-t-3xl border-t border-default",
  top:
    "absolute top-0 left-0 w-full max-h-[90dvh] rounded-b-3xl border-b border-default",
};

const sideTransforms: Record<DrawerSide, { open: string; closed: string }> = {
  right: { open: "translateX(0)", closed: "translateX(100%)" },
  left: { open: "translateX(0)", closed: "translateX(-100%)" },
  bottom: { open: "translateY(0)", closed: "translateY(100%)" },
  top: { open: "translateY(0)", closed: "translateY(-100%)" },
};

export default function Drawer({
  open,
  onClose,
  side = "right",
  children,
  overlayClassName = "bg-black/30",
  panelClassName = "",
}: DrawerProps) {
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

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60]"
      aria-hidden={!open}
      style={{
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 ${overlayClassName}`}
        style={{
          opacity: open ? 1 : 0,
          transition: `opacity ${DURATION_MS}ms ease-in-out`,
        }}
      />

      <aside
        role="dialog"
        aria-modal="true"
        className={[
          sideStyles[side],
          "overflow-y-auto bg-surface-1 shadow-2xl",
          panelClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          transform: open ? sideTransforms[side].open : sideTransforms[side].closed,
          opacity: open ? 1 : 0,
          transition: `transform ${DURATION_MS}ms ease-in-out, opacity ${DURATION_MS}ms ease-in-out`,
          willChange: "transform, opacity",
        }}
      >
        {children}
      </aside>
    </div>,
    document.body
  );
}