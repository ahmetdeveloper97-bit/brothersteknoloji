import { useEffect } from "react";
import Logo from "@/components/base/Logo";
import {
  formatRemainingText,
  pad2,
  saveMaintenanceConfig,
  useCountdown,
  useMaintenanceConfig,
} from "@/lib/maintenance";
import { loadStoreSettings } from "@/lib/adminStore";
import { useContactInfo } from "@/hooks/useContactInfo";

interface CountBoxProps {
  value: string;
  label: string;
  muted?: boolean;
}

function CountBox({ value, label, muted = false }: CountBoxProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border md:h-28 md:w-32 ${
          muted
            ? "border-background-300 bg-background-100"
            : "border-background-200 bg-background-50 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.55)]"
        }`}
      >
        <span className="font-heading text-4xl font-extrabold tabular-nums tracking-tight text-foreground-950 md:text-5xl">
          {value}
        </span>
        <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-background-200/70" />
      </div>
      <span className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground-500">{label}</span>
    </div>
  );
}

export default function MaintenanceScreen() {
  const config = useMaintenanceConfig();
  const remaining = useCountdown(config.endsAt);
  const settings = loadStoreSettings();
  const contact = useContactInfo();
  const isLive = remaining.total <= 0;

  useEffect(() => {
    if (!isLive || !config.enabled) return;
    const timer = window.setTimeout(() => {
      saveMaintenanceConfig({ ...config, enabled: false });
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [isLive, config]);

  const finishTime = new Date(config.endsAt).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-100">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-60" />
      <div className="pointer-events-none absolute -left-32 top-[-10%] h-[420px] w-[420px] rounded-full bg-accent-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-[-15%] h-[380px] w-[380px] rounded-full bg-primary-200/40 blur-3xl" />

      <header className="relative z-10 flex w-full items-center justify-between px-6 py-6 md:px-10">
        <Logo />
        <span className="flex items-center gap-2 rounded-full border border-background-300 bg-background-50/80 px-3 py-1.5 text-[11px] font-semibold text-foreground-700 backdrop-blur">
          <span className="relative flex h-2 w-2 items-center justify-center">
            <span className="absolute h-2 w-2 animate-ping rounded-full bg-accent-500" />
            <span className="h-2 w-2 rounded-full bg-accent-600" />
          </span>
          Bakım çalışması
        </span>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-10 md:px-10">
        <div className="w-full max-w-3xl rounded-3xl border border-background-200 bg-background-50 px-6 py-10 text-center shadow-[0_40px_90px_-60px_rgba(0,0,0,0.45)] md:px-12 md:py-14">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-800">
            <i className="ri-tools-line text-2xl" />
          </span>

          <h1 className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-foreground-950 md:text-[42px] md:leading-[1.1]">
            {isLive ? "Yayına alınıyor" : config.title}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-foreground-600 md:text-[15px]">
            {isLive
              ? "Son kontroller tamamlandı, mağaza birkaç saniye içinde yeniden hizmetinizde olacak."
              : config.message}
          </p>

          <div className="mt-8 flex items-start justify-center gap-3 md:gap-5">
            <CountBox value={pad2(remaining.hours)} label="Saat" muted={isLive} />
            <span className="pt-8 font-heading text-2xl font-bold text-foreground-300 md:pt-9 md:text-3xl">:</span>
            <CountBox value={pad2(remaining.minutes)} label="Dakika" muted={isLive} />
            <span className="pt-8 font-heading text-2xl font-bold text-foreground-300 md:pt-9 md:text-3xl">:</span>
            <CountBox value={pad2(remaining.seconds)} label="Saniye" muted={isLive} />
          </div>

          <p className="mt-5 text-xs text-foreground-500">
            {isLive ? (
              <span className="font-semibold text-accent-700">Mağaza açılıyor, lütfen sayfayı yenileyin.</span>
            ) : (
              <>
                Tahmini açılış saati <strong className="font-semibold text-foreground-800">{finishTime}</strong> · Kalan
                süre: <span className="tabular-nums">{formatRemainingText(config.endsAt - Date.now())}</span>
              </>
            )}
          </p>

          <div className="mt-9 grid grid-cols-1 gap-3 border-t border-background-200 pt-6 text-left sm:grid-cols-3">
            <div className="flex items-start gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background-100 text-primary-700">
                <i className="ri-shopping-bag-3-line" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground-900">Siparişler korunuyor</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-foreground-500">
                  Mevcut sipariş ve kargo süreçleri etkilenmez.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background-100 text-primary-700">
                <i className="ri-shield-check-line" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground-900">Güvenli altyapı</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-foreground-500">
                  Ödeme ve üyelik sistemleri güncelleniyor.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background-100 text-primary-700">
                <i className="ri-customer-service-2-line" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground-900">Bize ulaşın</p>
                {contact.email ? (
                  <a
                    href={contact.emailHref}
                    className="mt-0.5 block cursor-pointer truncate text-[11px] text-foreground-500 hover:text-primary-700"
                  >
                    {contact.email}
                  </a>
                ) : (
                  <p className="mt-0.5 text-[11px] text-foreground-500">İletişim bilgisi güncelleniyor</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 flex w-full flex-col items-center justify-between gap-2 border-t border-background-200 px-6 py-5 text-[11px] text-foreground-500 sm:flex-row md:px-10">
        <span>
          © {new Date().getFullYear()} {settings.storeName} · Tüm hakları saklıdır.
        </span>
        <a href="/arteadmin" className="cursor-pointer whitespace-nowrap font-semibold text-foreground-700 hover:text-primary-700">
          Yönetici girişi
        </a>
      </footer>
    </div>
  );
}