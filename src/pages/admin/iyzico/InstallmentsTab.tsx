import { useState } from "react";
import { Banner, Field, Panel, inputClass } from "@/components/base/AdminUI";
import { formatPrice } from "@/lib/format";
import type { IyzicoSettings } from "@/types/integrations";

interface InstallmentsTabProps {
  settings: IyzicoSettings;
  onSettings: (patch: Partial<IyzicoSettings>) => void;
}

export default function InstallmentsTab({ settings, onSettings }: InstallmentsTabProps) {
  const [amount, setAmount] = useState("10000");
  const [flash, setFlash] = useState("");

  const base = Number(amount.replace(",", ".")) || 0;

  const updateRate = (count: number, rate: number) => {
    onSettings({
      plans: settings.plans.map((plan) => (plan.count === count ? { ...plan, rate } : plan)),
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {flash && (
        <div className="xl:col-span-3">
          <Banner tone="success" onClose={() => setFlash("")}>
            {flash}
          </Banner>
        </div>
      )}

      <Panel className="xl:col-span-2" title="Taksit ve Vade Farkı" subtitle="Kart taksit oranlarını yönetin" icon="ri-calendar-2-line" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-background-200 text-[11px] uppercase tracking-wide text-foreground-500">
                <th className="px-4 py-2.5 font-semibold">Taksit</th>
                <th className="px-3 py-2.5 font-semibold">Vade farkı (%)</th>
                <th className="px-3 py-2.5 font-semibold">Aylık ödeme</th>
                <th className="px-4 py-2.5 text-right font-semibold">Toplam</th>
              </tr>
            </thead>
            <tbody>
              {settings.plans.map((plan) => {
                const total = base * (1 + plan.rate / 100);
                return (
                  <tr key={plan.count} className="border-b border-background-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground-950">
                      {plan.count === 1 ? "Tek çekim" : `${plan.count} taksit`}
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        step={0.1}
                        value={plan.rate}
                        onChange={(event) => updateRate(plan.count, Number(event.target.value))}
                        className={`${inputClass} h-8 w-20 text-xs`}
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-foreground-800">
                      {formatPrice(total / plan.count)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold text-foreground-950">
                      {formatPrice(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-background-200 p-4">
          <button
            type="button"
            onClick={() => setFlash("Taksit oranları kaydedildi ve ödeme sayfasına uygulandı.")}
            className="h-9 cursor-pointer rounded-lg bg-primary-800 px-4 text-sm font-semibold text-background-50 hover:bg-primary-700"
          >
            Oranları Kaydet
          </button>
        </div>
      </Panel>

      <div className="space-y-4">
        <Panel title="Örnek Hesaplama" subtitle="Taksit tablosunu test edin" icon="ri-calculator-line">
          <Field label="Sepet tutarı (₺)">
            <input value={amount} onChange={(event) => setAmount(event.target.value)} className={inputClass} />
          </Field>
          <div className="mt-3 space-y-2">
            {settings.plans.slice(0, 4).map((plan) => {
              const total = base * (1 + plan.rate / 100);
              return (
                <div key={plan.count} className="flex items-center justify-between rounded-lg bg-background-100 px-3 py-2 text-xs">
                  <span className="text-foreground-700">
                    {plan.count === 1 ? "Tek çekim" : `${plan.count} x`}
                  </span>
                  <span className="font-semibold text-foreground-950">{formatPrice(total / plan.count)}</span>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Komisyon Notu" icon="ri-information-line">
          <p className="text-[11px] leading-relaxed text-foreground-600">
            Vade farkı oranları iyzico sözleşmenizdeki komisyonlara göre belirlenmelidir. Oranlar 0 ise taksit farkı
            müşteriye yansıtılmaz, maliyet satıcıya aittir.
          </p>
        </Panel>
      </div>
    </div>
  );
}