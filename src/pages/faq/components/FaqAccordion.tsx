import type { FaqItem } from "@/types/faq";

interface FaqAccordionProps {
  items: FaqItem[];
  openId: string | null;
  onToggle: (id: string) => void;
}

export default function FaqAccordion({ items, openId, onToggle }: FaqAccordionProps) {
  return (
    <div className="space-y-2.5">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div
            key={item.id}
            id={`faq-${item.id}`}
            className={`scroll-mt-[190px] overflow-hidden rounded-xl border bg-background-50 transition-colors ${
              open ? "border-primary-300" : "border-background-200 hover:border-background-300"
            }`}
          >
            <h3 className="m-0">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => onToggle(item.id)}
                className="flex w-full cursor-pointer items-start gap-3 px-4 py-3.5 text-left"
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                    open
                      ? "bg-primary-800 text-background-50"
                      : "bg-background-100 text-foreground-500"
                  }`}
                >
                  <i className={open ? "ri-subtract-line" : "ri-add-line"} />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-sm font-semibold leading-snug ${
                      open ? "text-primary-900 dark:text-primary-950" : "text-foreground-950"
                    }`}
                  >
                    {item.question}
                  </span>
                </span>
                <i
                  className={`ri-arrow-down-s-line mt-1 shrink-0 text-base text-foreground-400 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h3>
            {open && (
              <div className="border-t border-background-200 px-4 pb-4 pt-3 pl-[52px]">
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground-700">{item.answer}</p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {item.keywords.slice(0, 3).map((keyword) => (
                    <span
                      key={`${item.id}-${keyword}`}
                      className="rounded-full bg-background-100 px-2 py-0.5 text-[10px] font-medium text-foreground-500"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}