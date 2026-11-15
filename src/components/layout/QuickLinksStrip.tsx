import { Link, useLocation } from "react-router-dom";
import { useQuickLinks } from "@/hooks/useQuickLinks";
import { resolveQuickLinkHref } from "@/lib/quickLinks";
import type { QuickLinkItem } from "@/types/quickLink";

interface QuickLinkBadgeProps {
  item: QuickLinkItem;
  active?: boolean;
  size?: "sm" | "md";
}

export function QuickLinkBadge({ item, active = false, size = "md" }: QuickLinkBadgeProps) {
  const dimension = size === "sm" ? "h-10 w-10" : "h-[78px] w-[78px]";
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br p-[3px] transition-all duration-200 ${dimension} ${
        active
          ? "from-primary-600 via-accent-500 to-secondary-500 shadow-md"
          : "from-background-200 via-background-100 to-background-300"
      }`}
    >
      <span
        className={`flex h-full w-full items-center justify-center overflow-hidden rounded-full ${
          item.imageUrl
            ? "bg-background-100"
            : "bg-gradient-to-br from-primary-100 to-accent-100 text-primary-800 dark:from-primary-200 dark:to-secondary-200 dark:text-primary-950"
        }`}
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.label}
            title={`${item.label} kısayolu`}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <i className={`${item.icon} ${size === "sm" ? "text-lg" : "text-3xl"}`} />
        )}
      </span>
    </span>
  );
}

export default function QuickLinksStrip() {
  const items = useQuickLinks();
  const location = useLocation();
  const currentHref = `${location.pathname}${location.search}`;

  if (items.length === 0) return null;

  return (
    <div className="hidden w-full border-b border-background-200 bg-background-50 lg:block">
      <div className="no-scrollbar mx-auto flex h-[134px] w-full max-w-[1320px] items-start justify-between gap-0.5 overflow-x-auto px-2 pt-3">
        {items.map((item) => {
          const href = resolveQuickLinkHref(item);
          const active = href === currentHref;
          return (
            <Link
              key={item.id}
              to={href}
              aria-current={active ? "page" : undefined}
              className="group flex min-w-[92px] flex-1 cursor-pointer flex-col items-center gap-2 rounded-xl px-1 py-1.5 transition-colors"
            >
              <span
                className={`transition-transform duration-200 ${
                  active ? "" : "group-hover:-translate-y-0.5 group-hover:scale-[1.04]"
                }`}
              >
                <QuickLinkBadge item={item} active={active} />
              </span>
              <span
                className={`line-clamp-2 h-8 w-full text-center text-xs leading-4 transition-colors ${
                  active ? "font-semibold text-foreground-950" : "font-medium text-foreground-700 group-hover:text-foreground-950"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}