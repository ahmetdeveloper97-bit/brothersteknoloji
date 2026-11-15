export interface PriceBand {
  id: string;
  label: string;
  min: number;
  max: number;
}

const formatBand = (value: number): string =>
  new Intl.NumberFormat("tr-TR").format(Math.round(value));

/** Aralık büyüklüğüne göre 1 / 2 / 2,5 / 5 / 10 dilimlerine oturan adım üretir. */
const niceStep = (span: number, targetBands: number): number => {
  const raw = span / targetBands;
  if (raw <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const normalized = raw / magnitude;
  const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10;
  return Math.max(1, factor * magnitude);
};

/**
 * Kategori içindeki gerçek fiyat aralığından hızlı seçim bantları üretir.
 * Bantlar yuvarlak rakamlara oturur ve son bant "ve üzeri" olarak açık uçlu kalır.
 */
export const buildPriceBands = (bounds: { min: number; max: number }): PriceBand[] => {
  const span = bounds.max - bounds.min;
  if (span <= 0) return [];

  const step = niceStep(span, 5);
  const start = Math.floor(bounds.min / step) * step;
  const bands: PriceBand[] = [];
  let edge = start;

  while (edge < bounds.max) {
    const next = edge + step;
    const isLast = next >= bounds.max;
    const bandMin = Math.max(bounds.min, edge);

    bands.push({
      id: `band-${edge}`,
      min: bandMin,
      max: isLast ? bounds.max : next - 1,
      label: isLast
        ? `${formatBand(bandMin)} ₺ ve üzeri`
        : `${formatBand(bandMin)} – ${formatBand(next - 1)} ₺`,
    });

    if (isLast) break;
    edge = next;
  }

  return bands;
};

/** Seçili aralık bir bantla birebir örtüşüyor mu? */
export const isBandActive = (
  band: PriceBand,
  price: { min: number; max: number }
): boolean =>
  Math.round(price.min) === Math.round(band.min) &&
  Math.round(price.max) === Math.round(band.max);