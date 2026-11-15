import type { ReactNode } from "react";
import Modal from "@/components/base/Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  subtitle?: string;
  icon?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  footnote?: string;
  children?: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  subtitle,
  icon = "ri-delete-bin-6-line",
  confirmLabel = "Sil",
  cancelLabel = "Vazgeç",
  footnote = "Bu işlem geri alınamaz.",
  children,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      subtitle={subtitle}
      icon={icon}
      onClose={onCancel}
      maxWidth="max-w-md"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-9 cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium text-foreground-700 hover:bg-background-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-foreground-900 px-4 text-xs font-semibold text-background-50 hover:bg-foreground-800"
          >
            <i className="ri-delete-bin-6-line" />
            {confirmLabel}
          </button>
        </div>
      }
    >
      <div className="space-y-2.5">
        {children}
        <p className="flex items-start gap-1.5 rounded-lg bg-background-100 px-3 py-2 text-[11px] leading-relaxed text-foreground-600">
          <i className="ri-alert-line mt-0.5" />
          {footnote}
        </p>
      </div>
    </Modal>
  );
}