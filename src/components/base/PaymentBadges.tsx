const ALL_BRANDS = ["ssl", "iyzico", "mastercard", "visa", "amex", "troy"] as const;

type Brand = (typeof ALL_BRANDS)[number];

interface PaymentBadgesProps {
  size?: "sm" | "md";
  className?: string;
  brands?: readonly Brand[];
}

const brandLabels: Record<Brand, string> = {
  ssl: "256-bit SSL güvenli ödeme",
  iyzico: "iyzico",
  mastercard: "Mastercard",
  visa: "Visa",
  amex: "American Express",
  troy: "Troy",
};

export default function PaymentBadges({ size = "sm", className = "", brands = ALL_BRANDS }: PaymentBadgesProps) {
  const chip = size === "sm" ? "h-7 px-2 text-[10px]" : "h-9 px-2.5 text-[11px]";
  const shell = `flex shrink-0 items-center justify-center gap-1 rounded-md border border-black/10 bg-white shadow-sm ${chip}`;
  const circle = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {brands.map((brand) => {
        if (brand === "amex") {
          return (
            <span
              key={brand}
              role="img"
              aria-label={brandLabels[brand]}
              title={brandLabels[brand]}
              className={`flex shrink-0 items-center justify-center rounded-md bg-[#006FCF] font-extrabold tracking-[0.16em] text-white shadow-sm ${chip}`}
            >
              AMEX
            </span>
          );
        }

        if (brand === "mastercard") {
          return (
            <span key={brand} role="img" aria-label={brandLabels[brand]} title={brandLabels[brand]} className={shell}>
              <span className="flex items-center">
                <span className={`${circle} rounded-full bg-[#EB001B]`} />
                <span className={`${circle} -ml-1.5 rounded-full bg-[#F79E1B]/90`} />
              </span>
            </span>
          );
        }

        if (brand === "visa") {
          return (
            <span
              key={brand}
              role="img"
              aria-label={brandLabels[brand]}
              title={brandLabels[brand]}
              className={`${shell} font-extrabold italic tracking-[0.12em] text-[#1A1F71]`}
            >
              VISA
            </span>
          );
        }

        if (brand === "iyzico") {
          return (
            <span
              key={brand}
              role="img"
              aria-label={brandLabels[brand]}
              title={brandLabels[brand]}
              className={`${shell} gap-0.5 font-extrabold tracking-tight text-[#1B2A5E]`}
            >
              iyzico
              <span className="mb-1 h-1 w-1 rounded-full bg-[#F27A1A]" />
            </span>
          );
        }

        if (brand === "troy") {
          return (
            <span
              key={brand}
              role="img"
              aria-label={brandLabels[brand]}
              title={brandLabels[brand]}
              className={`${shell} gap-0.5 font-extrabold lowercase tracking-tight text-[#1B2A5E]`}
            >
              troy
              <span className="mb-1 h-1 w-1 rounded-full bg-[#E30613]" />
            </span>
          );
        }

        return (
          <span
            key={brand}
            role="img"
            aria-label={brandLabels[brand]}
            title={brandLabels[brand]}
            className={`${shell} font-extrabold tracking-tight text-[#14532D]`}
          >
            <i className="ri-lock-2-fill text-[#15803D]" />
            SSL
          </span>
        );
      })}
    </div>
  );
}