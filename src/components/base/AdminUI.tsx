import type { ReactNode } from "react";

export const inputClass =
  "box-border h-10 w-full rounded-lg border border-background-300 bg-background-50 px-3 text-sm text-foreground-900 outline-none transition-colors placeholder:text-foreground-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-300";

export const textareaClass =
  "box-border w-full rounded-lg border border-background-300 bg-background-50 px-3 py-2.5 text-sm leading-relaxed text-foreground-900 outline-none transition-colors placeholder:text-foreground-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-300";

export type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-background-200 text-foreground-800",
  success: "bg-accent-100 text-accent-900",
  warning: "bg-secondary-200 text-secondary-950",
  danger: "bg-foreground-200 text-foreground-900",
  info: "bg-primary-100 text-primary-900 dark:bg-primary-200 dark:text-primary-950",
};

export function Pill({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

interface PanelProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}

export function Panel({ title, subtitle, icon, action, children, className = "", padded = true }: PanelProps) {
  return (
    <section className={`rounded-xl border border-background-200 bg-background-50 ${className}`}>
      {(title || action) && (
        <div className="flex flex-wrap items-center gap-2 border-b border-background-200 px-4 py-3 md:px-5">
          {icon && <i className={`${icon} text-base text-primary-700`} />}
          <div className="min-w-0 flex-1">
            {title && <h2 className="truncate font-heading text-sm font-bold text-foreground-950">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-foreground-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={padded ? "p-4 md:p-5" : ""}>{children}</div>
    </section>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  description?: string;
}

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`mt-0.5 flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors ${
          checked ? "bg-accent-600" : "bg-background-400"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-background-50 shadow transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
      {(label || description) && (
        <span className="min-w-0">
          {label && <span className="block text-sm font-medium text-foreground-900">{label}</span>}
          {description && <span className="mt-0.5 block text-xs leading-relaxed text-foreground-500">{description}</span>}
        </span>
      )}
    </label>
  );
}

interface KpiProps {
  icon: string;
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
}

export function Kpi({ icon, label, value, hint, tone = "info" }: KpiProps) {
  return (
    <div className="rounded-xl border border-background-200 bg-background-50 p-4">
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
          <i className={`${icon} text-base`} />
        </span>
        <p className="text-xs font-medium text-foreground-500">{label}</p>
      </div>
      <p className="mt-2.5 font-heading text-xl font-bold text-foreground-950">{value}</p>
      {hint && <p className="mt-0.5 text-[11px] text-foreground-500">{hint}</p>}
    </div>
  );
}

interface TabsProps<T extends string> {
  items: Array<{ id: T; label: string; icon?: string; badge?: number }>;
  value: T;
  onChange: (value: T) => void;
}

export function Tabs<T extends string>({ items, value, onChange }: TabsProps<T>) {
  return (
    <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto rounded-xl border border-background-200 bg-background-50 p-1">
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-primary-800 font-semibold text-background-50"
                : "text-foreground-600 hover:bg-background-100 hover:text-foreground-950"
            }`}
          >
            {item.icon && <i className={`${item.icon} text-base`} />}
            {item.label}
            {typeof item.badge === "number" && item.badge > 0 && (
              <span
                className={`rounded-full px-1.5 text-[10px] font-bold ${
                  active ? "bg-background-50/20 text-background-50" : "bg-accent-100 text-accent-900"
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface BannerProps {
  tone?: Tone;
  children: ReactNode;
  onClose?: () => void;
}

const bannerClasses: Record<Tone, string> = {
  neutral: "border-background-300 bg-background-100 text-foreground-800",
  success: "border-accent-300 bg-accent-50 text-accent-900",
  warning: "border-secondary-300 bg-secondary-100 text-secondary-950",
  danger: "border-foreground-300 bg-foreground-100 text-foreground-900",
  info: "border-primary-300 bg-primary-50 text-primary-900 dark:text-primary-950",
};

export function Banner({ tone = "info", children, onClose }: BannerProps) {
  return (
    <div className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-xs ${bannerClasses[tone]}`}>
      <i className="ri-information-line mt-0.5 text-sm" />
      <div className="min-w-0 flex-1 leading-relaxed">{children}</div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Kapat" className="cursor-pointer opacity-70 hover:opacity-100">
          <i className="ri-close-line" />
        </button>
      )}
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-foreground-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] leading-relaxed text-foreground-500">{hint}</span>}
    </label>
  );
}