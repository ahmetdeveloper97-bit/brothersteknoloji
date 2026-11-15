import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/base/ThemeToggle";
import { adminLogin, adminVerifyTwoFactor } from "@/lib/adminStaffStore";
import { roleLabels } from "@/lib/adminRoles";
import { logActivity } from "@/lib/activity";
import { totpSecondsRemaining } from "@/lib/totp";
import type { AdminStaff } from "@/types/adminRoles";

const features = [
  { title: "X Al Y Öde", text: "Esnek kampanya senaryoları", icon: "ri-gift-2-line" },
  { title: "Stok Yönetimi", text: "Gerçek zamanlı stok takibi", icon: "ri-stack-line" },
  { title: "Kargo Entegrasyonu", text: "Tek tıkla kargo etiketi", icon: "ri-truck-line" },
  { title: "Detaylı Raporlama", text: "Ciro ve dönüşüm analizleri", icon: "ri-bar-chart-box-line" },
  { title: "Pazaryeri Bağlantısı", text: "Trendyol, Hepsiburada, N11", icon: "ri-store-3-line" },
  { title: "AI Ürün Açıklaması", text: "Saniyeler içinde içerik üretimi", icon: "ri-sparkling-2-line" },
  { title: "Çoklu Para Birimi", text: "20+ para birimi desteği", icon: "ri-money-dollar-circle-line" },
  { title: "Rol Bazlı Yetki", text: "Ekip için güvenli erişim", icon: "ri-shield-keyhole-line" },
];

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [activeFeature, setActiveFeature] = useState(0);
  const [pending, setPending] = useState<{ challenge: string; member: AdminStaff } | null>(null);
  const [busy, setBusy] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpBusy, setOtpBusy] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(() => totpSecondsRemaining());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveFeature((current) => (current + 1) % features.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!pending) return;
    const timer = window.setInterval(() => setSecondsLeft(totpSecondsRemaining()), 1000);
    return () => window.clearInterval(timer);
  }, [pending]);

  const finishLogin = (member: AdminStaff, viaTotp: boolean) => {
    logActivity({
      category: "auth",
      action: "Panele giriş yaptı",
      target: "Yönetim paneli",
      detail: viaTotp
        ? `${member.email} · şifre + iki adımlı doğrulama ile giriş`
        : `${member.email} · kişisel şifre ile doğrulandı`,
    });
    navigate("/arteadmin");
  };

  const handleVerifyOtp = async (event: FormEvent) => {
    event.preventDefault();
    if (!pending || otpBusy) return;
    const clean = otp.replace(/\D/g, "");
    if (clean.length !== 6) {
      setError("6 haneli doğrulama kodunu girin.");
      return;
    }
    setError("");
    setOtpBusy(true);
    try {
      const result = await adminVerifyTwoFactor(pending.challenge, clean, remember);
      if (result.member) {
        finishLogin(result.member, true);
        return;
      }
      logActivity({
        category: "security",
        action: "2FA doğrulaması başarısız",
        target: "Yönetim paneli",
        detail: `${pending.member.email} · hatalı tek kullanımlık kod`,
        actorName: pending.member.name,
        actorEmail: pending.member.email,
        actorRole: roleLabels(pending.member.roles).join(" + "),
      });
      setError(result.message ?? "Kod geçersiz veya süresi dolmuş. Uygulamadaki güncel kodu girin.");
    } catch {
      setError("Doğrulama sırasında bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setOtpBusy(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (!email.trim() || !password.trim()) {
      setError("Lütfen e-posta ve şifre alanlarını doldurun.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const result = await adminLogin(email, password, remember);
      if (result.member) {
        finishLogin(result.member, false);
        return;
      }
      if (result.twoFactor) {
        setPending(result.twoFactor);
        setOtp("");
        return;
      }
      if (result.error === "not-found") {
        setError("Bu e-posta ile kayıtlı bir yönetici bulunamadı. E-postayı kontrol edin veya genel yöneticiden hesap oluşturmasını isteyin.");
        return;
      }
      if (result.error === "wrong-password") {
        setError("Şifre hatalı. Şifrenizi unuttuysanız genel yöneticiden sıfırlama isteyin.");
        return;
      }
      if (result.error === "inactive") {
        setError("Bu hesap pasife alınmış. Panele giriş için genel yönetici ile iletişime geçin.");
        return;
      }
      setError(result.message ?? "Giriş yapılamadı. Lütfen tekrar deneyin.");
    } catch {
      setError("Sunucuya ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  };

  const feature = features[activeFeature];

  return (
    <div className="flex min-h-screen bg-background-50">
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-background-100 via-background-50 to-background-200 md:block">
        <div className="dot-grid absolute inset-0 opacity-70" />
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-accent-200/40 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-primary-200/40 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-8">
          <div className="text-center">
            <h2 className="bg-gradient-to-r from-accent-700 via-accent-600 to-primary-600 bg-clip-text font-heading text-3xl font-bold tracking-tight text-transparent">
              E-Ticaretin Geleceği
            </h2>
            <p className="mt-2 max-w-xs text-sm text-foreground-600">Yeni nesil e-ticaret yönetim paneli</p>
          </div>

          <div className="mt-12 w-full max-w-md">
            <div
              key={feature.title}
              className="flex h-24 animate-fadeUp items-center gap-5 rounded-2xl border border-background-200 bg-background-50/80 px-6 shadow-lg backdrop-blur"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-700 to-primary-500 text-background-50 shadow-md dark:from-primary-600 dark:to-primary-400">
                <i className={`${feature.icon} text-2xl`} />
              </span>
              <div className="min-w-0">
                <h3 className="truncate font-heading text-lg font-semibold text-foreground-950">{feature.title}</h3>
                <p className="mt-0.5 truncate text-sm text-foreground-600">{feature.text}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {features.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  aria-label={`${item.title} özelliğine git`}
                  onClick={() => setActiveFeature(index)}
                  className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                    index === activeFeature
                      ? "w-6 bg-gradient-to-r from-accent-600 to-primary-600"
                      : "w-2 bg-background-300 hover:bg-background-400"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent-400/60 to-transparent" />
        </div>
      </div>

      <div className="relative flex w-full flex-col md:w-1/2">
        <div className="flex h-16 items-center justify-end gap-2 px-4 sm:px-6">
          <Link
            to="/"
            className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm text-foreground-600 hover:bg-background-100 hover:text-foreground-950 sm:flex"
          >
            <i className="ri-store-2-line" />
            Mağazaya Dön
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-10 sm:px-6">
          <div className="w-full max-w-[440px]">
            <div className="mb-8 text-center md:hidden">
              <h2 className="bg-gradient-to-r from-accent-700 via-accent-600 to-primary-600 bg-clip-text font-heading text-xl font-bold tracking-tight text-transparent">
                E-Ticaretin Geleceği
              </h2>
              <p className="mt-1 text-sm text-foreground-500">Yeni nesil e-ticaret yönetim paneli</p>
            </div>

            <div className="mb-6 hidden text-center md:block">
              <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground-950 sm:text-2xl">
                Profesyonel E-Ticaret Deneyimine Hoşgeldiniz
              </h1>
              <p className="mt-1.5 text-sm text-foreground-600">Devam etmek için giriş yapın</p>
            </div>

            <div className="rounded-xl border border-background-200 bg-background-50 p-7 shadow-sm sm:p-9">
              {pending ? (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="rounded-lg border border-primary-200 bg-primary-50 px-3 py-2.5">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-primary-900">
                      <i className="ri-shield-keyhole-line" />
                      İki adımlı doğrulama
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-foreground-600">
                      {pending.member.name} hesabı 2FA ile korunuyor. Authenticator uygulamasındaki 6 haneli kodu girin.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="admin-otp" className="text-sm font-medium text-foreground-800">
                      Doğrulama kodu
                    </label>
                    <input
                      id="admin-otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      autoFocus
                      value={otp}
                      onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="123456"
                      className="h-11 w-full rounded-md border border-background-300 bg-background-50 px-3 text-center font-mono text-lg tracking-[0.4em] text-foreground-900 outline-none transition-all placeholder:text-foreground-400 hover:border-background-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                    <p className="text-[11px] text-foreground-500">Kodun yenilenmesine {secondsLeft} saniye</p>
                  </div>

                  {error && (
                    <p className="flex items-center gap-1.5 rounded-md bg-secondary-100 px-3 py-2 text-xs text-foreground-800">
                      <i className="ri-error-warning-line text-sm" />
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={otpBusy}
                    className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-gradient-to-r from-primary-800 to-primary-600 text-sm font-semibold text-background-50 shadow-sm transition-all hover:from-primary-700 hover:to-primary-500 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {otpBusy && <i className="ri-loader-4-line animate-spin" />}
                    Doğrula ve Giriş Yap
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPending(null);
                      setOtp("");
                      setError("");
                    }}
                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap text-xs font-medium text-foreground-600 hover:text-foreground-950"
                  >
                    <i className="ri-arrow-left-line" />
                    Geri dön
                  </button>
                </form>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="admin-email" className="text-sm font-medium text-foreground-800">
                    E-posta
                  </label>
                  <input
                    id="admin-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="ornek@sirket.com"
                    className="h-10 w-full rounded-md border border-background-300 bg-background-50 px-3 text-sm text-foreground-900 outline-none transition-all placeholder:text-foreground-400 hover:border-background-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="admin-password" className="text-sm font-medium text-foreground-800">
                    Şifre
                  </label>
                  <div className="relative">
                    <input
                      id="admin-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="******"
                      className="h-10 w-full rounded-md border border-background-300 bg-background-50 px-3 pr-10 text-sm text-foreground-900 outline-none transition-all placeholder:text-foreground-400 hover:border-background-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                      className="absolute right-0 top-0 flex h-10 w-10 cursor-pointer items-center justify-center text-foreground-500 hover:text-foreground-800"
                    >
                      <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setRemember((value) => !value)}
                    aria-pressed={remember}
                    className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground-700"
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                        remember
                          ? "border-primary-700 bg-primary-700 text-background-50"
                          : "border-background-400 bg-background-50"
                      }`}
                    >
                      {remember && <i className="ri-check-line text-[11px]" />}
                    </span>
                    Beni hatırla
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setError(
                        "Şifrenizi unuttuysanız genel yönetici Yöneticiler ekranındaki kilit simgesiyle size özel geçici bir şifre oluşturabilir. Giriş yaptıktan sonra profilinizden şifrenizi kendiniz değiştirebilirsiniz.",
                      )
                    }
                    className="cursor-pointer whitespace-nowrap text-sm font-medium text-primary-700 hover:text-primary-900"
                  >
                    Şifremi unuttum
                  </button>
                </div>

                {error && (
                  <p className="flex items-center gap-1.5 rounded-md bg-secondary-100 px-3 py-2 text-xs text-foreground-800">
                    <i className="ri-error-warning-line text-sm" />
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-gradient-to-r from-primary-800 to-primary-600 text-sm font-semibold text-background-50 shadow-sm transition-all hover:from-primary-700 hover:to-primary-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {busy && <i className="ri-loader-4-line animate-spin" />}
                  Giriş Yap
                </button>
              </form>
              )}
            </div>

            <p className="mt-6 text-center text-xs text-foreground-400">v1.0.6</p>
          </div>
        </div>
      </div>
    </div>
  );
}