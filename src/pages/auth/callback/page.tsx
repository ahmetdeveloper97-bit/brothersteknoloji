import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { EmailOtpType } from "@supabase/supabase-js";
import Logo from "@/components/base/Logo";
import { DEFAULT_POST_AUTH_PATH, validateOrdinaryPostAuthNext } from "@/lib/authRedirect";
import { supabase } from "@/lib/supabase";

type Status = "working" | "error";

const RECOVERY_REDIRECT = "/hesabim?sekme=guvenlik";

const KNOWN_OTP_TYPES: EmailOtpType[] = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
];

const toOtpType = (value: string | null): EmailOtpType => {
  const candidate = (value ?? "").toLowerCase();
  return (KNOWN_OTP_TYPES.find((type) => type === candidate) ?? "signup") as EmailOtpType;
};

const readHashParams = (): URLSearchParams => {
  const raw = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
  return new URLSearchParams(raw);
};

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [status, setStatus] = useState<Status>("working");
  const [message, setMessage] = useState("E-posta adresiniz doğrulanıyor...");
  const started = useRef(false);

  const next = params.get("next");
  const code = params.get("code");
  const tokenHash = params.get("token_hash");
  const otpType = toOtpType(params.get("type"));
  const providerError = params.get("error");
  const providerErrorDescription = params.get("error_description");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const hashParams = readHashParams();
    const hashError = hashParams.get("error_description") || hashParams.get("error");
    const hashAccessToken = hashParams.get("access_token");
    const hashRefreshToken = hashParams.get("refresh_token");
    const hashType = hashParams.get("type");

    if (providerError || hashError) {
      setStatus("error");
      const description = providerErrorDescription || hashError || "";
      setMessage(
        description
          ? description.replace(/\+/g, " ")
          : "Doğrulama bağlantısı geçersiz veya süresi dolmuş. Lütfen tekrar deneyin.",
      );
      return;
    }

    const goNext = (isRecovery: boolean) => {
      if (isRecovery || hashType === "recovery" || otpType === "recovery") {
        navigate(RECOVERY_REDIRECT, { replace: true });
        return;
      }
      setMessage("Giriş başarılı, hesabınıza yönlendiriliyorsunuz...");
      navigate(validateOrdinaryPostAuthNext(next) || DEFAULT_POST_AUTH_PATH, { replace: true });
    };

    const run = async () => {
      try {
        if (tokenHash) {
          const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: otpType });
          if (error) {
            setStatus("error");
            setMessage(
              error.message.toLowerCase().includes("expired")
                ? "Bu doğrulama bağlantısının süresi dolmuş. Giriş ekranından yeni bağlantı isteyebilirsiniz."
                : error.message || "Bağlantı doğrulanamadı. Lütfen tekrar deneyin.",
            );
            return;
          }
          goNext(false);
          return;
        }

        if (hashAccessToken && hashRefreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: hashAccessToken,
            refresh_token: hashRefreshToken,
          });
          if (error) {
            setStatus("error");
            setMessage(error.message || "Oturum başlatılamadı. Lütfen tekrar deneyin.");
            return;
          }
          goNext(false);
          return;
        }

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setStatus("error");
            setMessage(
              error.message.toLowerCase().includes("expired")
                ? "Bu doğrulama bağlantısının süresi dolmuş. Giriş ekranından yeni bağlantı isteyebilirsiniz."
                : error.message || "Doğrulama tamamlanamadı. Lütfen tekrar deneyin.",
            );
            return;
          }
          goNext(data.redirectType === "recovery");
          return;
        }

        setStatus("error");
        setMessage("Doğrulama bağlantısı eksik veya süresi dolmuş. Lütfen giriş ekranından yeni bağlantı isteyin.");
      } catch {
        setStatus("error");
        setMessage("Bağlantı sırasında bir sorun oluştu. Lütfen tekrar giriş yapmayı deneyin.");
      }
    };

    void run();
  }, [code, tokenHash, otpType, next, providerError, providerErrorDescription, navigate]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background-100 via-background-50 to-background-200">
      <div className="dot-grid absolute inset-0 opacity-40" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Logo />
          <Link to="/" className="text-sm text-foreground-600 hover:text-foreground-950">
            Mağazaya Dön
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-12">
          <div className="w-full max-w-[440px] rounded-xl border border-background-200 bg-background-50 p-7 text-center shadow-sm sm:p-9">
            {status === "working" ? (
              <>
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                  <i className="ri-loader-4-line animate-spin text-2xl" />
                </span>
                <h1 className="mt-5 font-heading text-lg font-semibold text-foreground-950">Doğrulanıyor</h1>
                <p className="mt-2 text-sm leading-relaxed text-foreground-600">{message}</p>
                <p className="mt-5 text-[11px] text-foreground-400">
                  Bu işlem birkaç saniye sürebilir, sayfayı kapatmayın.
                </p>
              </>
            ) : (
              <>
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary-100 text-secondary-900">
                  <i className="ri-error-warning-line text-2xl" />
                </span>
                <h1 className="mt-5 font-heading text-lg font-semibold text-foreground-950">Doğrulama tamamlanamadı</h1>
                <p className="mt-2 text-sm leading-relaxed text-foreground-600">{message}</p>

                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    to="/giris"
                    className="flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-gradient-to-r from-primary-800 to-primary-600 text-sm font-semibold text-background-50 transition-colors hover:from-primary-700 hover:to-primary-500"
                  >
                    <i className="ri-mail-send-line" />
                    Giriş ekranından yeni bağlantı al
                  </Link>
                  <Link
                    to="/"
                    className="flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-300 text-sm font-medium text-foreground-800 transition-colors hover:bg-background-100"
                  >
                    <i className="ri-store-2-line" />
                    Mağazaya git
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}