import { useState } from "react";
import { formatPrice } from "@/lib/format";
import PaymentBadges from "@/components/base/PaymentBadges";
import type { InstallmentPlan } from "@/types/integrations";

interface PaymentFormProps {
  plans: InstallmentPlan[];
  total: number;
  installment: number;
  onInstallment: (count: number) => void;
  onSubmit: () => void;
  threeDSecure: boolean;
  enabled: boolean;
  processing: boolean;
}

export default function PaymentForm({ plans, total, installment, onInstallment, onSubmit, threeDSecure, enabled, processing }: PaymentFormProps) {
  const [agreement, setAgreement] = useState(false);
  const [error, setError] = useState("");

  const selectedPlan = plans.find((plan) => plan.count === installment) ?? plans[0] ?? { count: 1, rate: 0 };
  const payable = total * (1 + selectedPlan.rate / 100);

  const submit = () => {
    if (!agreement) {
      setError("Ön bilgilendirme formunu onaylamanız gerekiyor.");
      return;
    }
    setError("");
    onSubmit();
  };

  return (
    <section className="rounded-xl border border-background-200 bg-background-50">
      <div className="flex flex-wrap items-center gap-2 border-b border-background-200 px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-100 text-primary-900">
          <i className="ri-bank-card-line text-sm" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-sm font-bold text-foreground-950">Kart ile Ödeme</h2>
          <p className="text-[11px] text-foreground-500">iyzico güvenli ödeme sayfası üzerinden</p>
        </div>
        <span className="rounded-md bg-accent-50 px-2 py-1 text-[10px] font-semibold text-accent-900">
          {enabled ? (threeDSecure ? "3D Secure aktif" : "3D Secure kapalı") : "POS pasif"}
        </span>
      </div>

      <div className="space-y-4 p-4 md:p-5">
        {!enabled && (
          <p className="rounded-lg border border-secondary-300 bg-secondary-100 px-3 py-2.5 text-xs text-secondary-950">
            Sanal POS şu anda kapalı. Yönetim panelinden iyzico ayarlarını aktifleştirebilirsiniz.
          </p>
        )}

        <div className="flex items-start gap-2.5 rounded-lg border border-background-200 bg-background-100 px-3 py-3">
          <i className="ri-shield-check-line mt-0.5 text-lg text-accent-700" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground-900">Kart bilgilerinizi iyzico&apos;nun kendi sayfasında gireceksiniz</p>
            <p className="mt-1 text-[11px] leading-relaxed text-foreground-600">
              Ödemeyi onayladığınızda bankanızın 3D Secure doğrulama ekranına yönlendirilirsiniz. Kart numarası, CVV ve
              şifre bilgileri sitemizde saklanmaz; doğrudan iyzico tarafından işlenir.
            </p>
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-foreground-700">Taksit seçeneği</span>
          <select
            value={installment}
            onChange={(event) => onInstallment(Number(event.target.value))}
            className="box-border h-10 w-full cursor-pointer rounded-lg border border-background-300 bg-background-50 px-3 text-sm text-foreground-900 outline-none focus:border-primary-500"
          >
            {plans.map((plan) => {
              const planTotal = total * (1 + plan.rate / 100);
              return (
                <option key={plan.count} value={plan.count}>
                  {plan.count === 1
                    ? `Tek çekim · ${formatPrice(planTotal)}`
                    : `${plan.count} taksit · ${formatPrice(planTotal / plan.count)} x ${plan.count}`}
                </option>
              );
            })}
          </select>
        </label>

        <label className="flex cursor-pointer items-start gap-2 rounded-lg bg-background-100 p-3">
          <input
            type="checkbox"
            checked={agreement}
            onChange={(event) => setAgreement(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer"
          />
          <span className="text-[11px] leading-relaxed text-foreground-600">
            <strong className="font-semibold text-foreground-900">Ön bilgilendirme formunu</strong> ve mesafeli satış
            sözleşmesini okudum, onaylıyorum.
          </span>
        </label>

        {error && (
          <p className="flex items-center gap-1.5 rounded-lg border border-secondary-300 bg-secondary-100 px-3 py-2 text-xs text-secondary-950">
            <i className="ri-error-warning-line" />
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={!enabled || processing}
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-800 text-sm font-semibold text-background-50 shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {processing ? (
            <>
              <i className="ri-loader-4-line animate-spin" />
              Banka sayfasına yönlendiriliyorsunuz...
            </>
          ) : (
            <>
              <i className="ri-lock-2-line" />
              {formatPrice(payable)} Öde ve Devam Et
            </>
          )}
        </button>

        <p className="text-center text-[10px] leading-relaxed text-foreground-500">
          Ödeme onayından sonra sipariş numaranız ekranda gösterilir ve e-posta ile iletilir.
        </p>

        <div className="border-t border-background-200 pt-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-1.5">
            <p className="text-xs font-semibold text-foreground-800">Taksit tablosu</p>
            <span className="text-[10px] text-foreground-500">
              {selectedPlan.count === 1 ? "Tek çekim seçili" : `${selectedPlan.count} taksit seçili`}
            </span>
          </div>

          <div className="overflow-hidden rounded-lg border border-background-200">
            <table className="w-full text-[11px]">
              <thead className="bg-background-100 text-foreground-500">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Taksit</th>
                  <th className="px-3 py-2 text-right font-semibold">Aylık ödeme</th>
                  <th className="hidden px-3 py-2 text-right font-semibold sm:table-cell">Vade farkı</th>
                  <th className="px-3 py-2 text-right font-semibold">Toplam</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => {
                  const planTotal = total * (1 + plan.rate / 100);
                  const active = plan.count === installment;
                  return (
                    <tr
                      key={plan.count}
                      onClick={() => onInstallment(plan.count)}
                      className={`cursor-pointer border-t border-background-200 transition-colors ${
                        active ? "bg-primary-50" : "hover:bg-background-100"
                      }`}
                    >
                      <td className="px-3 py-2">
                        <span
                          className={`flex items-center gap-1.5 ${
                            active ? "font-semibold text-foreground-950" : "font-medium text-foreground-800"
                          }`}
                        >
                          <i
                            className={
                              active
                                ? "ri-checkbox-circle-fill text-primary-600"
                                : "ri-checkbox-blank-circle-line text-foreground-300"
                            }
                          />
                          {plan.count === 1 ? "Tek çekim" : `${plan.count} taksit`}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-foreground-800">{formatPrice(planTotal / plan.count)}</td>
                      <td className="hidden px-3 py-2 text-right text-foreground-500 sm:table-cell">
                        {plan.rate > 0 ? `%${plan.rate}` : "—"}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-foreground-950">{formatPrice(planTotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-1.5 text-[10px] leading-relaxed text-foreground-500">
            Bir satıra dokunarak taksit sayısını değiştirebilirsiniz. Vade farkı oranları iyzico sözleşmenize göre
            uygulanır.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-background-100 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[10px] font-medium text-foreground-600">
            <i className="ri-shield-check-line text-sm text-accent-700" />
            Tüm kartlar kabul edilir
          </p>
          <PaymentBadges size="sm" brands={["iyzico", "visa", "mastercard", "amex", "troy"]} />
        </div>
      </div>
    </section>
  );
}