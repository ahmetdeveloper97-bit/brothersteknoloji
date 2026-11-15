export const formatPrice = (value: number): string =>
  `${new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} ₺`;

export const formatCompact = (value: number): string =>
  new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(value);