interface CheckoutStepsProps {
  deliveryDone: boolean;
  billingDone: boolean;
  paid: boolean;
}

const steps = [
  { id: "adim-teslimat", label: "Teslimat", icon: "ri-truck-line" },
  { id: "adim-fatura", label: "Fatura", icon: "ri-receipt-line" },
  { id: "adim-odeme", label: "Ödeme", icon: "ri-bank-card-line" },
];

export default function CheckoutSteps({ deliveryDone, billingDone, paid }: CheckoutStepsProps) {
  const completed = [deliveryDone || paid, billingDone || paid, paid];
  const activeIndex = paid ? 2 : deliveryDone ? (billingDone ? 2 : 1) : 0;

  const goStep = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <ol className="flex items-stretch gap-1 rounded-xl border border-background-200 bg-background-50 p-2 sm:gap-2 sm:p-3">
      {steps.map((step, index) => {
        const isCompleted = completed[index];
        const isActive = index === activeIndex;
        return (
          <li key={step.id} className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => goStep(step.id)}
              aria-current={isActive ? "step" : undefined}
              className={`flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors ${
                isActive ? "bg-primary-50" : "hover:bg-background-100"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  isCompleted
                    ? "bg-accent-600 text-background-50"
                    : isActive
                      ? "bg-primary-800 text-background-50 ring-2 ring-primary-200"
                      : "bg-background-200 text-foreground-500"
                }`}
              >
                {isCompleted ? <i className="ri-check-line" /> : index + 1}
              </span>
              <span className="min-w-0">
                <span
                  className={`hidden text-[9px] font-semibold uppercase tracking-wide sm:block ${
                    isActive ? "text-primary-700" : "text-foreground-400"
                  }`}
                >
                  Adım {index + 1}
                </span>
                <span
                  className={`block truncate text-[11px] font-semibold sm:text-xs ${
                    isCompleted || isActive ? "text-foreground-950" : "text-foreground-500"
                  }`}
                >
                  {step.label}
                </span>
              </span>
            </button>
            {index < steps.length - 1 && (
              <span
                className={`h-0.5 w-3 shrink-0 rounded-full sm:w-6 ${
                  completed[index] ? "bg-accent-500" : "bg-background-300"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}