import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Logo from "@/components/base/Logo";
import ThemeToggle from "@/components/base/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { oauthCallbackUrl, validateOrdinaryPostAuthNext } from "@/lib/authRedirect";
import {
  formatCooldown,
  remainingCooldownSeconds,
  startEmailCooldown,
} from "@/lib/authCooldown";
import { supabase } from "@/lib/supabase";
import ProviderStatusPanel from "@/pages/auth/components/ProviderStatusPanel";

type Mode = "login" | "signup";
type Busy = "" | "email" | "google" | "apple" | "reset";

const friendlyAuthError = (message: string): string => {
  const text = message.toLowerCase();
  if (text.includes("invalid login credentials")) return "E-posta veya şifre hatalı. Bilgilerinizi kontrol edin.";
  if (text.includes("email not confirmed")) return "E-posta adresiniz henüz onaylanmadı. Gelen kutunuzdaki bağlantıya tıklayın ya da aşağıdan yeni bir onay e-postası isteyin.";
  if (text.includes("email link is invalid or has expired")) return "Doğrulama bağlantısının süresi dolmuş. Aşağıdan yeni bir onay e-postası isteyebilirsiniz.";
  if (text.includes("token has expired") || text.includes("invalid otp")) return "Doğrulama bağlantısı geçersiz veya süresi dolmuş. Aşağıdan yeni bir onay e-postası isteyin.";
  if (text.includes("user already registered")) return "Bu e-posta ile kayıtlı bir hesap var. Giriş yapmayı deneyin.";
  if (text.includes("rate limit") || text.includes("too many requests") || text.includes("over_email_send_rate_limit")) {
    return "E-posta gönderim sınırına takıldık. Sistem kısa süre içinde çok fazla e-posta gönderdiği için bir süre yeni e-posta yollayamıyor. Yaklaşık 1 saat sonra tekrar deneyin ya da birkaç dakika bekleyip yeniden deneyin.";
  }
  if (text.includes("provider is not enabled")) return "Bu giriş yöntemi henüz etkin değil. E-posta ile devam edebilirsiniz.";
  if (text.includes("password should be at least")) return "Şifre en az 6 karakter olmalı.";
  return message;
};

export default function UserLoginPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [searchParams] = useSearchParams();
  const nextParam = searchParams.get("next");
  const showDiagnostics = searchParams.get("durum") === "1";
  const [mode, setMode] = useState<Mode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState<Busy>("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    setCooldown(email.trim() ? remainingCooldownSeconds(email) : 0);
  }, [email]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = window.setInterval(() => {
      const next = email.trim() ? remainingCooldownSeconds(email) : 0;
      setCooldown(next);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown, email]);

  useEffect(() => {
    if (session) navigate(validateOrdinaryPostAuthNext(nextParam), { replace: true });
  }, [session, nextParam, navigate]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
    setNotice("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setError("");
    setNotice("");

    if (!email.trim() || !password) {
      setError("Lütfen e-posta ve şifre alanlarını doldurun.");
      return;
    }
    if (mode === "signup" && password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }

    setBusy("email");
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: oauthCallbackUrl("/hesabim?sekme=profil"),
          },
        });
        if (signUpError) {
          setError(friendlyAuthError(signUpError.message));
        } else if (!data.session) {
          startEmailCooldown(email, 60);
          setCooldown(remainingCooldownSeconds(email));
          setNotice("Hesabınız oluşturuldu. Onay bağlantısı için e-posta kutunuzu kontrol edin.");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) setError(friendlyAuthError(signInError.message));
      }
    } catch {
      setError("Bağlantı sırasında bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setBusy("");
    }
  };

  const providerLogin = async (provider: "google" | "apple") => {
    if (busy) return;
    const providerName = provider === "google" ? "Google" : "Apple";
    setError("");
    setNotice("");
    setBusy(provider);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: oauthCallbackUrl(nextParam ?? undefined),
          ...(provider === "google" ? { queryParams: { prompt: "select_account" } } : {}),
        },
      });
      if (oauthError) {
        const disabled = oauthError.message.toLowerCase().includes("provider is not enabled");
        setError(
          disabled
            ? `${providerName} ile giriş bu sitede henüz etkin değil. Yönetici Supabase panelinden sağlayıcıyı açabilir; bu süreçte e-posta ve şifre ile giriş yapabilirsiniz.`
            : friendlyAuthError(oauthError.message),
        );
        setBusy("");
      }
    } catch {
      setError(`${providerName} sağlayıcısına bağlanılamadı. Lütfen tekrar deneyin.`);
      setBusy("");
    }
  };

  const resendConfirmation = async () => {
    if (!email.trim()) {
      setError("Onay e-postası için önce e-posta adresinizi girin.");
      return;
    }
    const wait = remainingCooldownSeconds(email);
    if (wait > 0) {
      setCooldown(wait);
      setError(`Çok sık denemeyin: yeni onay e-postası için ${formatCooldown(wait)} bekleyin.`);
      return;
    }
    setResending(true);
    setError("");
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: { emailRedirectTo: oauthCallbackUrl("/hesabim?sekme=profil") },
      });
      if (resendError) setError(friendlyAuthError(resendError.message));
      else {
        startEmailCooldown(email, 60);
        setCooldown(remainingCooldownSeconds(email));
        setNotice("Yeni onay e-postası gönderildi. Gelen kutunuzu ve spam klasörünü kontrol edin.");
      }
    } catch {
      setError("Onay e-postası gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setResending(false);
    }
  };

  const sendReset = async () => {
    if (!email.trim()) {
      setError("Şifre sıfırlama bağlantısı için önce e-posta adresinizi girin.");
      return;
    }
    setBusy("reset");
    setError("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: oauthCallbackUrl("/hesabim?sekme=guvenlik"),
    });
    if (resetError) setError(friendlyAuthError(resetError.message));
    else {
      startEmailCooldown(email, 60);
      setCooldown(remainingCooldownSeconds(email));
      setNotice("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
    }
    setBusy("");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background-100 via-background-50 to-background-200">
      <div className="dot-grid absolute inset-0 opacity-40" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden text-sm text-foreground-600 hover:text-foreground-950 sm:block">
              Mağazaya Dön
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-12">
          <div className="w-full max-w-[440px]">
            {showDiagnostics && <ProviderStatusPanel />}
            <div className="mb-6 text-center">
              <h1 className="font-heading text-2xl font-bold text-foreground-950">
                {mode === "login" ? "Hesabınıza Giriş Yapın" : "Yeni Hesap Oluşturun"}
              </h1>
              <p className="mt-1.5 text-sm text-foreground-600">
                {mode === "login"
                  ? "Siparişlerinizi, adreslerinizi ve faturalarınızı tek yerden yönetin"
                  : "Birkaç saniyede üye olun, alışverişe devam edin"}
              </p>
            </div>

            <div className="rounded-xl border border-background-200 bg-background-50 p-6 shadow-sm md:p-7">
              <div className="mb-5 grid grid-cols-2 gap-1 rounded-full bg-background-100 p-1">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`h-9 cursor-pointer whitespace-nowrap rounded-full text-sm font-semibold transition-colors ${
                    mode === "login"
                      ? "bg-background-50 text-foreground-950 shadow-sm"
                      : "text-foreground-600 hover:text-foreground-900"
                  }`}
                >
                  Giriş Yap
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={`h-9 cursor-pointer whitespace-nowrap rounded-full text-sm font-semibold transition-colors ${
                    mode === "signup"
                      ? "bg-background-50 text-foreground-950 shadow-sm"
                      : "text-foreground-600 hover:text-foreground-900"
                  }`}
                >
                  Üye Ol
                </button>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => providerLogin("google")}
                  disabled={busy !== ""}
                  className="flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 whitespace-nowrap rounded-lg border border-background-300 bg-background-50 text-sm font-semibold text-foreground-900 transition-colors hover:bg-background-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {busy === "google" ? (
                    <i className="ri-loader-4-line animate-spin text-lg" />
                  ) : (
                    <i className="ri-google-fill text-lg text-[#ea4335]" />
                  )}
                  {busy === "google" ? "Google'a yönlendiriliyor..." : "Google ile devam et"}
                </button>
                <button
                  type="button"
                  onClick={() => providerLogin("apple")}
                  disabled={busy !== ""}
                  className="flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 whitespace-nowrap rounded-lg bg-foreground-950 text-sm font-semibold text-background-50 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {busy === "apple" ? (
                    <i className="ri-loader-4-line animate-spin text-lg" />
                  ) : (
                    <i className="ri-apple-fill text-lg" />
                  )}
                  {busy === "apple" ? "Apple'a yönlendiriliyor..." : "Apple ile devam et"}
                </button>
              </div>

              <div className="relative my-5 py-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-background-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background-50 px-2 text-[11px] uppercase tracking-wider text-foreground-400">
                    veya e-posta ile
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-1.5">
                    <label htmlFor="user-name" className="text-sm font-medium text-foreground-800">
                      Ad Soyad
                    </label>
                    <input
                      id="user-name"
                      name="full_name"
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Adınız Soyadınız"
                      className="h-10 w-full rounded-md border border-background-300 bg-background-50 px-3 text-sm text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="user-email" className="text-sm font-medium text-foreground-800">
                    E-posta
                  </label>
                  <input
                    id="user-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="ornek@mail.com"
                    className="h-10 w-full rounded-md border border-background-300 bg-background-50 px-3 text-sm text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="user-password" className="text-sm font-medium text-foreground-800">
                      Şifre
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={sendReset}
                        className="cursor-pointer text-xs font-medium text-primary-700 hover:underline"
                      >
                        {busy === "reset" ? "Gönderiliyor..." : "Şifremi unuttum"}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="user-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="En az 6 karakter"
                      className="h-10 w-full rounded-md border border-background-300 bg-background-50 pl-3 pr-10 text-sm text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                      className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-100"
                    >
                      <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"} />
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-secondary-100 px-3 py-2 text-xs leading-relaxed text-foreground-800">
                    <p className="flex items-start gap-1.5">
                      <i className="ri-error-warning-line mt-0.5" />
                      <span className="min-w-0 flex-1">{error}</span>
                    </p>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={resendConfirmation}
                        disabled={resending || cooldown > 0}
                        className="mt-2 inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md bg-background-50 px-2.5 py-1.5 text-[11px] font-semibold text-primary-700 transition-colors hover:bg-background-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {resending ? (
                          <i className="ri-loader-4-line animate-spin" />
                        ) : (
                          <i className="ri-mail-send-line" />
                        )}
                        {resending
                          ? "Gönderiliyor..."
                          : cooldown > 0
                            ? `Onay e-postası (${formatCooldown(cooldown)})`
                            : "Onay e-postasını tekrar gönder"}
                      </button>
                    )}
                  </div>
                )}
                {notice && (
                  <p className="flex items-start gap-1.5 rounded-md bg-accent-50 px-3 py-2 text-xs leading-relaxed text-accent-900">
                    <i className="ri-mail-check-line mt-0.5" />
                    <span className="min-w-0 flex-1">{notice}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy === "email"}
                  className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-gradient-to-r from-primary-800 to-primary-600 text-sm font-semibold text-background-50 transition-colors hover:from-primary-700 hover:to-primary-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {busy === "email" && <i className="ri-loader-4-line animate-spin" />}
                  {mode === "login" ? "Giriş Yap" : "Hesap Oluştur"}
                </button>
              </form>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-foreground-400">
                Devam ederek{" "}
                <Link to="/gizlilik-politikasi" className="underline hover:text-foreground-700">
                  Gizlilik Politikası
                </Link>{" "}
                ve{" "}
                <Link to="/cerez-politikasi" className="underline hover:text-foreground-700">
                  Çerez Politikası
                </Link>
                'nı kabul etmiş olursunuz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}