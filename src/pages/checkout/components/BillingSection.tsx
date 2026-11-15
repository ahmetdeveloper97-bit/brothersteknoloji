import { Link } from "react-router-dom";
import type { BillingProfileRow } from "@/types/account";

interface BillingSectionProps {
  billing: BillingProfileRow | null;
  loading: boolean;
  loggedIn: boolean;
  email: string;
}

export default function BillingSection({ billing, loading, loggedIn, email }: BillingSectionProps) {
  const isCorporate = billing?.invoice_type === "corporate";
  const title = isCorporate ? billing?.company_name || "Kurumsal fatura" : billing?.full_name || "Bireysel fatura";
  const addressLine = [billing?.address_line, [billing?.district, billing?.city].filter(Boolean).join(" / ")]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="rounded-xl border border-background-200 bg-background-50">
      <div className="flex flex-wrap items-center gap-2 border-b border-background-200 px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-100 text-primary-900">
          <i className="ri-receipt-line text-sm" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-sm font-bold text-foreground-950">Fatura Bilgileri</h2>
          <p className="text-[11px] text-foreground-500">Sipariş sonrası e-faturanız bu bilgilerle oluşturulur</p>
        </div>
        {loggedIn && (
          <Link
            to="/hesabim?sekme=fatura-bilgileri"
            className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-semibold text-primary-700 hover:bg-primary-50"
          >
            <i className="ri-edit-line" /> Düzenle
          </Link>
        )}
      </div>

      <div className="p-4">
        {!loggedIn ? (
          <p className="flex items-start gap-1.5 rounded-lg bg-background-100 px-3 py-2.5 text-[11px] leading-relaxed text-foreground-600">
            <i className="ri-information-line mt-0.5" />
            <span>
              <Link to="/giris" className="font-semibold underline decoration-dotted">
                Giriş yapın
              </Link>
              , kayıtlı fatura bilgilerinizle faturanız otomatik hazırlanır.
            </span>
          </p>
        ) : loading ? (
          <p className="flex items-center gap-1.5 text-[11px] text-foreground-500">
            <i className="ri-loader-4-line animate-spin" />
            Fatura bilgileri yükleniyor...
          </p>
        ) : billing ? (
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="whitespace-nowrap rounded-full bg-background-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground-700">
                {isCorporate ? "Kurumsal" : "Bireysel"}
              </span>
              <p className="min-w-0 flex-1 truncate text-xs font-semibold text-foreground-950">{title}</p>
            </div>
            <dl className="grid grid-cols-1 gap-1.5 text-[11px] sm:grid-cols-2">
              {isCorporate && (
                <div className="flex gap-1.5">
                  <dt className="text-foreground-500">Vergi dairesi:</dt>
                  <dd className="font-medium text-foreground-900">{billing.tax_office || "—"}</dd>
                </div>
              )}
              <div className="flex gap-1.5">
                <dt className="text-foreground-500">{isCorporate ? "VKN:" : "TCKN:"}</dt>
                <dd className="font-medium text-foreground-900">{billing.tax_number || "—"}</dd>
              </div>
              <div className="flex min-w-0 gap-1.5 sm:col-span-2">
                <dt className="text-foreground-500">E-posta:</dt>
                <dd className="truncate font-medium text-foreground-900">{billing.email || email || "—"}</dd>
              </div>
              {addressLine && (
                <div className="flex min-w-0 gap-1.5 sm:col-span-2">
                  <dt className="text-foreground-500">Adres:</dt>
                  <dd className="font-medium text-foreground-900">{addressLine}</dd>
                </div>
              )}
            </dl>
            <p className="flex items-start gap-1.5 rounded-lg bg-accent-50 px-2.5 py-2 text-[10px] leading-relaxed text-accent-900">
              <i className="ri-checkbox-circle-line mt-0.5" />
              Faturanız bu bilgilerle otomatik oluşturulup hesabınıza eklenecek.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            <p className="text-[11px] leading-relaxed text-foreground-600">
              Kayıtlı fatura bilginiz yok. Şimdi ekleyin, sonraki siparişlerinizde tekrar yazmanıza gerek kalmasın.
            </p>
            <Link
              to="/hesabim?sekme=fatura-bilgileri"
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-3 text-xs font-semibold text-foreground-800 hover:bg-background-100"
            >
              <i className="ri-add-line" /> Fatura Bilgisi Ekle
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}