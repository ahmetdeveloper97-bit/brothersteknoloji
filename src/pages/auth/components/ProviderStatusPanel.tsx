import { useCallback, useEffect, useState } from "react";
import { fetchAuthProviderReport } from "@/lib/authProviders";
import type { AuthProviderReport, ProviderState } from "@/lib/authProviders";

const LABELS: Array<{ key: "email" | "google" | "apple"; label: string; icon: string }> = [
  { key: "email", label: "E-posta ve şifre", icon: "ri-mail-line" },
  { key: "google", label: "Google ile giriş", icon: "ri-google-fill" },
  { key: "apple", label: "Apple ile giriş", icon: "ri-apple-fill" },
];

const stateStyle = (state: ProviderState): { text: string; badge: string; label: string } => {
  if (state === "enabled") {
    return { text: "text-accent-900", badge: "bg-accent-100", label: "Açık" };
  }
  if (state === "disabled") {
    return { text: "text-secondary-900", badge: "bg-secondary-100", label: "Kapalı" };
  }
  return { text: "text-foreground-700", badge: "bg-background-200", label: "Bilinmiyor" };
};

export default function ProviderStatusPanel() {
  const [report, setReport] = useState<AuthProviderReport | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await fetchAuthProviderReport();
    setReport(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const googleEnabled = report?.google === "enabled";

  return (
    <div className="mb-5 rounded-xl border border-background-200 bg-background-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-background-100 text-foreground-700">
            <i className="ri-shield-check-line" />
          </span>
          <h2 className="truncate font-heading text-sm font-bold text-foreground-950">
            Giriş sağlayıcı durumu
          </h2>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-background-300 px-2.5 text-xs font-semibold text-foreground-800 transition-colors hover:bg-background-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <i className={loading ? "ri-loader-4-line animate-spin" : "ri-refresh-line"} />
          Yenile
        </button>
      </div>

      <ul className="space-y-1.5">
        {LABELS.map((item) => {
          const state = report ? report[item.key] : "unknown";
          const style = stateStyle(state);
          return (
            <li
              key={item.key}
              className="flex items-center justify-between gap-2 rounded-md bg-background-100 px-2.5 py-1.5"
            >
              <span className="flex min-w-0 items-center gap-2">
                <i className={`${item.icon} text-sm text-foreground-600`} />
                <span className="truncate text-xs font-medium text-foreground-800">{item.label}</span>
              </span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${style.badge} ${style.text}`}
              >
                {loading ? "Kontrol ediliyor" : style.label}
              </span>
            </li>
          );
        })}
      </ul>

      {!loading && report && (
        <p className="mt-2.5 text-[11px] leading-relaxed text-foreground-500">
          {googleEnabled
            ? "Google sağlayıcısı Supabase üzerinde açık görünüyor. Butona bastığınızda Google hesap seçme ekranı gelmelidir."
            : "Google henüz açık görünmüyor. Supabase panelinde Google sağlayıcısına Client ID ve Client Secret girilip kaydedilmelidir."}
        </p>
      )}
      {!loading && report && !report.reachable && (
        <p className="mt-1.5 text-[11px] leading-relaxed text-secondary-900">{report.message}</p>
      )}
    </div>
  );
}