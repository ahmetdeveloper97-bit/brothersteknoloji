import type { PcSelection, PcSlot } from "@/types/pcBuilder";
import type { BuildCheck } from "@/lib/pcBuilder";
import { selectedPart } from "@/lib/pcBuilder";

interface BuildSummaryProps {
  slots: PcSlot[];
  selection: PcSelection;
  check: BuildCheck;
  onRemove: (slotId: string) => void;
  onSelectSlot: (slotId: string) => void;
  onClear: () => void;
  onAddToCart: () => void;
}

const money = (value: number): string => new Intl.NumberFormat("tr-TR").format(Math.round(value));

export default function BuildSummary({
  slots,
  selection,
  check,
  onRemove,
  onSelectSlot,
  onClear,
  onAddToCart,
}: BuildSummaryProps) {
  const chosen = slots
    .map((slot) => ({ slot, part: selectedPart(selection, slot.id) }))
    .filter((entry) => Boolean(entry.part));

  const blocked = check.issues.length > 0 || check.missingRequired.length > 0;

  return (
    <aside className="space-y-3 xl:sticky xl:top-[252px]">
      <div className="rounded-2xl border border-background-200 bg-background-50 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-base font-bold text-foreground-950">Sistem Özeti</h2>
          <span className="rounded-full bg-background-100 px-2 py-0.5 text-[11px] font-semibold text-foreground-700">
            {check.selectedCount}/{slots.length}
          </span>
        </div>

        {chosen.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-background-300 px-3 py-8 text-center text-xs text-foreground-500">
            Soldan bir bileşen seçerek sisteminizi toplamaya başlayın.
          </p>
        ) : (
          <div className="mt-3 space-y-1.5">
            {chosen.map(({ slot, part }) => (
              <div
                key={slot.id}
                className="group flex items-start gap-2 rounded-lg px-1 py-1.5 transition-colors hover:bg-background-100"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background-100 text-foreground-600">
                  <i className={`${slot.icon} text-xs`} />
                </span>
                <button
                  type="button"
                  onClick={() => onSelectSlot(slot.id)}
                  className="min-w-0 flex-1 cursor-pointer text-left"
                >
                  <span className="block text-[11px] text-foreground-500">{slot.name}</span>
                  <span className="block truncate text-xs font-medium text-foreground-900">
                    {part?.name}
                  </span>
                </button>
                <div className="flex shrink-0 items-center gap-1">
                  <span className="whitespace-nowrap text-xs font-semibold text-foreground-900">
                    {money(part?.price ?? 0)} ₺
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(slot.id)}
                    aria-label={`${slot.name} seçimini kaldır`}
                    className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-foreground-400 hover:bg-background-200 hover:text-accent-700"
                  >
                    <i className="ri-close-line text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 space-y-1.5 border-t border-background-200 pt-3 text-xs">
          <div className="flex items-center justify-between text-foreground-600">
            <span>Tahmini tüketim</span>
            <span className="font-semibold text-foreground-900">{check.wattage} W</span>
          </div>
          <div className="flex items-center justify-between text-foreground-600">
            <span>Bileşen sayısı</span>
            <span className="font-semibold text-foreground-900">{check.selectedCount} adet</span>
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between border-t border-background-200 pt-3">
          <span className="text-xs font-medium text-foreground-600">Toplam</span>
          <div className="text-right">
            <p className="font-heading text-xl font-extrabold text-foreground-950">{money(check.total)} ₺</p>
            <p className="text-[10px] text-foreground-500">KDV dahil</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddToCart}
          disabled={blocked}
          className={`mt-3 flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
            blocked
              ? "cursor-not-allowed bg-background-200 text-foreground-400"
              : "cursor-pointer bg-primary-700 text-background-50 hover:bg-primary-600"
          }`}
        >
          <i className="ri-shopping-cart-2-line" />
          Sistemi Sepete Ekle
        </button>

        {blocked && (
          <p className="mt-2 text-center text-[11px] text-foreground-500">
            {check.missingRequired.length > 0
              ? `${check.missingRequired.length} zorunlu bileşen eksik.`
              : "Uyumsuz bileşenler var, sepete eklemeden önce düzeltin."}
          </p>
        )}

        <button
          type="button"
          onClick={onClear}
          className="mt-2 w-full cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-3 py-2 text-xs font-medium text-foreground-700 transition-colors hover:bg-background-100"
        >
          Seçimleri temizle
        </button>
      </div>

      <div className="rounded-2xl border border-background-200 bg-background-50 p-4 shadow-sm">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-500">
          <i className="ri-shield-check-line text-sm text-primary-700" />
          Uyumluluk Kontrolü
        </h3>
        {check.issues.length === 0 && check.warnings.length === 0 ? (
          <p className="mt-2 flex items-start gap-1.5 text-xs text-primary-800">
            <i className="ri-checkbox-circle-fill mt-0.5 text-primary-600" />
            {check.selectedCount > 0
              ? "Seçilen bileşenler birbiriyle uyumlu görünüyor."
              : "Bileşen seçtikçe uyumluluk otomatik kontrol edilir."}
          </p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {check.issues.map((issue) => (
              <li key={`e-${issue.slot}-${issue.message}`} className="flex items-start gap-1.5 text-[11px] text-accent-800">
                <i className="ri-close-circle-fill mt-0.5 shrink-0 text-accent-600" />
                {issue.message}
              </li>
            ))}
            {check.warnings.map((issue) => (
              <li key={`w-${issue.slot}-${issue.message}`} className="flex items-start gap-1.5 text-[11px] text-foreground-600">
                <i className="ri-alert-line mt-0.5 shrink-0 text-accent-600" />
                {issue.message}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary-800">
          <i className="ri-customer-service-2-line text-sm" />
          Kurumsal Destek
        </h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-foreground-700">
          Toplu alımlarda özel fiyat, kurulum ve devreye alma desteği için teknik ekibimizle görüşebilirsiniz.
        </p>
        <a
          href="tel:+908502220040"
          className="mt-2 flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-background-50 px-3 py-2 text-xs font-semibold text-primary-800 hover:bg-background-100"
        >
          <i className="ri-phone-line" />
          0850 222 00 40
        </a>
      </div>
    </aside>
  );
}