import type { ReactNode } from "react";

export const accountInput =
  "h-10 w-full rounded-lg border border-background-300 bg-background-50 px-3 text-sm text-foreground-900 outline-none transition-colors placeholder:text-foreground-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20";

export const accountTextarea =
  "w-full rounded-lg border border-background-300 bg-background-50 px-3 py-2 text-sm leading-relaxed text-foreground-900 outline-none transition-colors placeholder:text-foreground-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20";

export function AccountCard({
  title,
  subtitle,
  icon,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-background-200 bg-background-50 p-5 md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {icon && (
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
              <i className={`${icon} text-base`} />
            </span>
          )}
          <div>
            <h2 className="font-heading text-base font-bold text-foreground-950">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs leading-relaxed text-foreground-500">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AccountField({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor} className="text-xs font-semibold text-foreground-700">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-[11px] leading-relaxed text-foreground-400">{hint}</p>}
    </div>
  );
}

export function InlineAlert({ tone = "info", children }: { tone?: "info" | "success" | "error"; children: ReactNode }) {
  const styles: Record<string, string> = {
    info: "border-secondary-200 bg-secondary-50 text-secondary-900",
    success: "border-accent-300 bg-accent-50 text-accent-900",
    error: "border-primary-300 bg-primary-50 text-primary-900",
  };
  const icons: Record<string, string> = {
    info: "ri-information-line",
    success: "ri-checkbox-circle-line",
    error: "ri-error-warning-line",
  };
  return (
    <p className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-xs leading-relaxed ${styles[tone]}`}>
      <i className={`${icons[tone]} mt-0.5 text-sm`} />
      <span className="min-w-0 flex-1">{children}</span>
    </p>
  );
}

export function AccountButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
  loading,
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}) {
  const base =
    "inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-4 text-sm font-semibold transition-colors";
  const variants: Record<string, string> = {
    primary: "bg-primary-800 text-background-50 hover:bg-primary-700",
    ghost: "border border-background-300 text-foreground-800 hover:bg-background-100",
    danger: "border border-primary-300 text-primary-800 hover:bg-primary-50",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${
        disabled || loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
    >
      {loading ? <i className="ri-loader-4-line animate-spin text-base" /> : icon ? <i className={`${icon} text-base`} /> : null}
      {children}
    </button>
  );
}