import { Link } from "react-router-dom";
import { formatCountdown, type NightWindowState } from "@/lib/nightDeals";

interface NightDealBannerProps {
  state: NightWindowState;
}

/** Gece indirimi sayfasının üstünde duran canlı durum şeridi. */
export function NightDealBanner({ state }: NightDealBannerProps) {
  return (
    <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-foreground-950 px-4 py-4 text-background-50 sm:flex-row sm:items-center sm:justify-between md:px-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-primary-200">
          <i className="ri-moon-clear-line text-xl" />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-heading text-sm font-semibold md:text-base">
            {state.open ? "Gece indirimi aktif" : "Gece indirimi henüz başlamadı"}
            <span
              className={`flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                state.open ? "bg-accent-500 text-foreground-950" : "bg-background-50/15 text-background-100"
              }`}
            >
              <i className={state.open ? "ri-flashlight-fill text-[11px]" : "ri-time-line text-[11px]"} />
              {state.open ? "Yayında" : "Bekliyor"}
            </span>
          </p>
          <p className="mt-1 text-xs leading-relaxed text-background-300 md:text-[13px]">
            {state.open
              ? `İndirimli fiyatlar saat ${state.endLabel}'a kadar geçerli. Süre dolduğunda bu sayfa otomatik kapanır.`
              : `Bu sayfadaki ürünler ve indirimli fiyatlar saat ${state.startLabel}'da açılacak.`}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 rounded-xl bg-background-50/10 px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-background-300">
          {state.open ? "Kapanışa" : "Açılışa"}
        </span>
        <span className="font-heading text-lg font-bold tabular-nums tracking-tight text-background-50">
          {formatCountdown(state.remainingMs)}
        </span>
      </div>
    </div>
  );
}

interface NightDealLockProps {
  state: NightWindowState;
  productCount: number;
}

/** Saat aralığı dışında ürünlerin fiyatları gösterilmez, bunun yerine bu ekran görünür. */
export function NightDealLock({ state, productCount }: NightDealLockProps) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-background-300 bg-background-50">
      <div className="flex flex-col items-center px-6 py-12 text-center md:py-16">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground-950 text-primary-200">
          <i className="ri-lock-2-line text-3xl" />
        </span>
        <h2 className="mt-4 font-heading text-xl font-bold text-foreground-950 md:text-2xl">
          Gece indirimi saat {state.startLabel}'da başlıyor
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-foreground-600">
          Bu sayfadaki indirimli fiyatlar yalnızca saat {state.startLabel} – {state.endLabel} arasında geçerlidir.
          Açılış saatinde ürünler ve özel fiyatlar bu sayfada otomatik olarak görünür.
        </p>

        <div className="mt-5 flex items-center gap-2 rounded-xl border border-background-300 bg-background-100 px-4 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-500">Açılışa kalan</span>
          <span className="font-heading text-2xl font-bold tabular-nums text-foreground-950">
            {formatCountdown(state.remainingMs)}
          </span>
        </div>

        <p className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-foreground-500">
          <i className="ri-gift-line text-primary-600" />
          {productCount > 0
            ? `${productCount} ürün bu gece indirimli fiyatla sunulacak.`
            : "Bu gece için ürün seçimi yönetim panelinden yapılır."}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link
            to="/kategoriler"
            className="cursor-pointer whitespace-nowrap rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-background-50 hover:bg-primary-600"
          >
            Tüm Ürünleri Gör
          </Link>
          <Link
            to="/kampanyalar"
            className="cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-5 py-2.5 text-sm font-medium text-foreground-800 hover:bg-background-100"
          >
            Güncel Kampanyalar
          </Link>
        </div>
      </div>
    </div>
  );
}