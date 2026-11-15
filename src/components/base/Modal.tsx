import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  icon?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

export default function Modal({
  open,
  title,
  subtitle,
  icon,
  onClose,
  children,
  footer,
  maxWidth = "max-w-lg",
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center sm:items-center sm:p-4">
      <div onClick={onClose} className="absolute inset-0 bg-primary-950/50 backdrop-blur-sm" />
      <div
        className={`relative flex max-h-[92vh] w-full ${maxWidth} flex-col overflow-hidden rounded-t-2xl bg-background-50 shadow-2xl sm:rounded-2xl`}
      >
        <div className="flex items-start gap-3 border-b border-background-200 px-5 py-4">
          {icon && (
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-100 text-primary-700">
              <i className={`${icon} text-lg`} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-heading text-base font-bold text-foreground-950">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-foreground-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground-500 hover:bg-background-100 hover:text-foreground-900"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="border-t border-background-200 bg-background-100/60 px-5 py-3">{footer}</div>
        )}
      </div>
    </div>
  );
}