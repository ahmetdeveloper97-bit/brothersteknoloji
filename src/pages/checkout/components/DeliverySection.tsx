import { Link } from "react-router-dom";
import { TR_CITIES } from "@/lib/trCities";
import type { AddressRow, DeliveryDetails } from "@/types/account";

export const CITIES = TR_CITIES;

export const emptyDelivery: DeliveryDetails = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  district: "",
};

interface DeliverySectionProps {
  addresses: AddressRow[];
  loading: boolean;
  form: DeliveryDetails;
  autofilled: boolean;
  selectedAddressId: string;
  onSelectAddress: (id: string) => void;
  onChange: (patch: Partial<DeliveryDetails>) => void;
  saveAddress: boolean;
  onToggleSaveAddress: (value: boolean) => void;
  loggedIn: boolean;
  error: string;
}

export default function DeliverySection({
  addresses,
  loading,
  form,
  autofilled,
  selectedAddressId,
  onSelectAddress,
  onChange,
  saveAddress,
  onToggleSaveAddress,
  loggedIn,
  error,
}: DeliverySectionProps) {
  const fieldClass =
    "box-border h-10 w-full rounded-lg border border-background-300 bg-background-50 px-3 text-sm text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500";

  return (
    <section className="rounded-xl border border-background-200 bg-background-50">
      <div className="flex flex-wrap items-center gap-2 border-b border-background-200 px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-100 text-primary-900">
          <i className="ri-truck-line text-sm" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-sm font-bold text-foreground-950">Teslimat Bilgileri</h2>
          <p className="text-[11px] text-foreground-500">Siparişiniz bu adrese gönderilecek</p>
        </div>
        {loggedIn && addresses.length > 0 && (
          <span className="whitespace-nowrap rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-bold text-accent-900">
            {addresses.length} kayıtlı adres
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
        {loading && (
          <p className="flex items-center gap-1.5 rounded-lg bg-background-100 px-3 py-2 text-[11px] text-foreground-600 sm:col-span-2">
            <i className="ri-loader-4-line animate-spin" />
            Kayıtlı adresleriniz getiriliyor...
          </p>
        )}

        {!loading && loggedIn && addresses.length > 0 && (
          <label className="block min-w-0 sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-foreground-700">Kayıtlı adreslerim</span>
            <select
              value={selectedAddressId}
              onChange={(event) => onSelectAddress(event.target.value)}
              className="box-border h-10 w-full cursor-pointer rounded-lg border border-background-300 bg-background-50 px-3 text-sm text-foreground-900 outline-none focus:border-primary-500"
            >
              <option value="">Yeni adres gireceğim</option>
              {addresses.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.title} · {[row.district, row.city].filter(Boolean).join(" / ")}
                  {row.is_default ? " (varsayılan)" : ""}
                </option>
              ))}
            </select>
          </label>
        )}

        {!loading && loggedIn && addresses.length === 0 && (
          <p className="flex items-start gap-1.5 rounded-lg border border-secondary-200 bg-secondary-50 px-3 py-2 text-[11px] leading-relaxed text-secondary-900 sm:col-span-2">
            <i className="ri-information-line mt-0.5" />
            <span>
              Kayıtlı adresiniz yok. Bir kez kaydettiğinizde sonraki alışverişlerinizde otomatik dolar.{" "}
              <Link to="/hesabim?sekme=adresler" className="font-semibold underline decoration-dotted">
                Adres ekle
              </Link>
            </span>
          </p>
        )}

        {!loading && !loggedIn && (
          <p className="flex items-start gap-1.5 rounded-lg border border-secondary-200 bg-secondary-50 px-3 py-2 text-[11px] leading-relaxed text-secondary-900 sm:col-span-2">
            <i className="ri-information-line mt-0.5" />
            <span>
              <Link to="/giris" className="font-semibold underline decoration-dotted">
                Giriş yapın
              </Link>
              , adres ve fatura bilgileriniz otomatik dolsun.
            </span>
          </p>
        )}

        {autofilled && (
          <p className="flex items-center gap-1.5 rounded-lg bg-accent-50 px-3 py-2 text-[11px] font-medium text-accent-900 sm:col-span-2">
            <i className="ri-magic-line" />
            Bilgiler kayıtlı adresinizden otomatik dolduruldu.
          </p>
        )}

        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-semibold text-foreground-700">Ad Soyad</span>
          <input
            value={form.fullName}
            onChange={(event) => onChange({ fullName: event.target.value })}
            placeholder="Ad Soyad"
            autoComplete="name"
            className={fieldClass}
          />
        </label>
        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-semibold text-foreground-700">Telefon</span>
          <input
            value={form.phone}
            onChange={(event) => onChange({ phone: event.target.value })}
            placeholder="05xx xxx xx xx"
            autoComplete="tel"
            className={fieldClass}
          />
        </label>
        <label className="block min-w-0 sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-foreground-700">Açık adres</span>
          <textarea
            value={form.address}
            onChange={(event) => onChange({ address: event.target.value.slice(0, 300) })}
            rows={2}
            placeholder="Mahalle, sokak, no, daire..."
            autoComplete="street-address"
            className="box-border w-full resize-none rounded-lg border border-background-300 bg-background-50 px-3 py-2 text-sm text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500"
          />
        </label>
        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-semibold text-foreground-700">İl</span>
          <select
            value={form.city}
            onChange={(event) => onChange({ city: event.target.value })}
            className="box-border h-10 w-full cursor-pointer rounded-lg border border-background-300 bg-background-50 px-3 text-sm text-foreground-900 outline-none focus:border-primary-500"
          >
            <option value="">İl seçin</option>
            {CITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-semibold text-foreground-700">İlçe</span>
          <input
            value={form.district}
            onChange={(event) => onChange({ district: event.target.value })}
            placeholder="Kadıköy"
            className={fieldClass}
          />
        </label>

        {loggedIn && !selectedAddressId && (
          <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-background-100 px-3 py-2 text-[11px] text-foreground-700 sm:col-span-2">
            <input
              type="checkbox"
              checked={saveAddress}
              onChange={(event) => onToggleSaveAddress(event.target.checked)}
              className="h-4 w-4 cursor-pointer accent-primary-700"
            />
            Bu adresi hesabıma kaydet, sonraki alımlarda otomatik dolsun
          </label>
        )}

        {error && (
          <p className="flex items-center gap-1.5 rounded-lg border border-secondary-300 bg-secondary-100 px-3 py-2 text-xs text-secondary-950 sm:col-span-2">
            <i className="ri-error-warning-line" />
            {error}
          </p>
        )}
      </div>
    </section>
  );
}