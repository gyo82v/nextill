"use client";

import Modal from "./Modal";
import Button from "../Button";
import { FaTriangleExclamation } from "react-icons/fa6";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  danger?: boolean;
  children?: React.ReactNode;
};

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  danger = false,
  children,
}: ConfirmModalProps) {
  const confirmVariant = danger ? "danger" : "confirm";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="md"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            variant={confirmVariant}
            loading={loading}
            loadingText={confirmLabel}
            onClick={onConfirm}
          >
            {danger ? (
              <FaTriangleExclamation className="text-sm" aria-hidden="true" />
            ) : null}
            <span>{confirmLabel}</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {danger ? (
          <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300">
              <FaTriangleExclamation className="text-sm" aria-hidden="true" />
            </span>

            <div className="space-y-1">
              <p className="font-medium text-foreground">
                This action cannot be undone.
              </p>
              <p className="text-sm text-muted-foreground">
                Please review carefully before confirming.
              </p>
            </div>
          </div>
        ) : null}

        <p className="text-sm text-muted-foreground">{description}</p>

        {children ? <div>{children}</div> : null}
      </div>
    </Modal>
  );
}