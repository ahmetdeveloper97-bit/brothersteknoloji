import { useCallback, useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { AccountButton, AccountCard, AccountField, InlineAlert, accountInput } from "@/components/base/AccountUI";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/accountFormat";
import { supabase } from "@/lib/supabase";
import type { MfaFactorView } from "@/types/account";

type Method = "authenticator" | "sms" | "email";

const methods: { id: Method; label: string; description: string; icon: string; available: boolean }[] = [
  {
    id: "authenticator",
    label: "Authenticator uygulaması",
    description: "Google Authenticator, Authy veya Microsoft Authenticator ile kod üretin.",
    icon: "ri-smartphone-line",
    available: true,
  },
  {
    id: "sms",
    label: "SMS ile kod",
    description: "Girişte kayıtlı telefonunuza tek kullanımlık kod gönderilir.",
    icon: "ri-message-2-line",
    available: false,
  },
  {
    id: "email",
    label: "E-posta ile kod",
    description: "Girişte e-posta adresinize tek kullanımlık kod gönderilir.",
    icon: "ri-mail-lock-line",
    available: false,
  },
];

export default function TwoFactorSection() {
  const { user } = useAuth();
  const [method, setMethod] = useState<Method>("authenticator");
  const [factors, setFactors] = useState<MfaFactorView[]>([]);
  const [loadingFactors, setLoadingFactors] = useState(true);
  const [enroll, setEnroll] = useState<{ factorId: string; uri: string; secret: string } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadFactors = useCallback(async () => {
    setLoadingFactors(true);
    try {
      const { data, error: listError } = await supabase.auth.mfa.listFactors();
      if (listError) throw listError;
      const list = (data?.totp ?? []).map((factor) => ({
        id: factor.id,
        friendlyName: factor.friendly_name ?? "Authenticator",
        verified: factor.status === "verified",
        createdAt: factor.created_at ?? "",
      })) as MfaFactorView[];
      setFactors(list);
    } catch {
      setError("İki adımlı doğrulama durumu okunamadı.");
    } finally {
      setLoadingFactors(false);
    }
  }, []);

  useEffect(() => {
    void loadFactors();
  }, [loadFactors]);

  const startEnroll = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Authenticator",
      });
      if (enrollError) throw enrollError;
      if (data) {
        setEnroll({ factorId: data.id, uri: data.totp.uri, secret: data.totp.secret });
        setCode("");
      }
    } catch {
      setError("Authenticator kurulumu başlatılamadı. Lütfen tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  };

  const cancelEnroll = async () => {
    if (enroll) {
      await supabase.auth.mfa.unenroll({ factorId: enroll.factorId });
    }
    setEnroll(null);
    setCode("");
    void loadFactors();
  };

  const verifyCode = async () => {
    if (!enroll) return;
    if (code.trim().length !== 6) {
      setError("6 haneli doğrulama kodunu girin.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: enroll.factorId,
      });
      if (challengeError) throw challengeError;
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: enroll.factorId,
        challengeId: challenge.id,
        code: code.trim(),
      });
      if (verifyError) throw verifyError;
      setEnroll(null);
      setCode("");
      setMessage("İki adımlı doğrulama etkinleştirildi. Sonraki girişlerde kod istenecek.");
      await loadFactors();
    } catch {
      setError("Kod doğrulanamadı. Uygulamadaki güncel kodu girip tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  };

  const disableFactor = async (factorId: string) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const { error: removeError } = await supabase.auth.mfa.unenroll({ factorId });
      if (removeError) throw removeError;
      setMessage("İki adımlı doğrulama kapatıldı.");
      await loadFactors();
    } catch {
      setError("Doğrulama kapatılamadı. Lütfen tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  };

  const verified = factors.filter((factor) => factor.verified);
  const pending = factors.filter((factor) => !factor.verified);
  const isActive = verified.length > 0;

  return (
    <AccountCard
      title="İki Adımlı Doğrulama (2FA)"
      subtitle="Hesabınızı şifrenin ötesinde ikinci bir katmanla koruyun."
      icon="ri-shield-keyhole-line"
      action={
        <span
          className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ${
            isActive ? "bg-accent-100 text-accent-800" : "bg-background-200 text-foreground-700"
          }`}
        >
          {isActive ? "Aktif" : "Kapalı"}
        </span>
      }
    >
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
        {methods.map((item) => {
          const selected = method === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setMethod(item.id);
                setError("");
                setMessage("");
              }}
              className={`flex cursor-pointer flex-col gap-1.5 rounded-xl border p-3 text-left transition-colors ${
                selected
                  ? "border-primary-400 bg-primary-50/60 ring-1 ring-primary-300"
                  : "border-background-200 bg-background-50 hover:border-background-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <i className={`${item.icon} text-base ${selected ? "text-primary-700" : "text-foreground-600"}`} />
                <span className="text-xs font-bold text-foreground-950">{item.label}</span>
                {!item.available && (
                  <span className="ml-auto whitespace-nowrap rounded-full bg-secondary-100 px-1.5 py-0.5 text-[9px] font-bold text-secondary-900">
                    Kurulum
                  </span>
                )}
              </span>
              <span className="text-[11px] leading-relaxed text-foreground-500">{item.description}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {method === "authenticator" ? (
          <div className="rounded-xl border border-background-200 bg-background-100/60 p-4">
            {loadingFactors ? (
              <p className="flex items-center gap-2 text-xs text-foreground-500">
                <i className="ri-loader-4-line animate-spin" /> Durum kontrol ediliyor...
              </p>
            ) : enroll ? (
              <div className="space-y-4">
                <p className="text-xs leading-relaxed text-foreground-700">
                  Aşağıdaki QR kodu authenticator uygulamanızla okutun, ardından uygulamanın gösterdiği 6 haneli kodu
                  girin.
                </p>
                <div className="flex flex-col items-start gap-4 sm:flex-row">
                  <div className="flex h-[148px] w-[148px] shrink-0 items-center justify-center rounded-lg border border-background-300 bg-white p-2">
                    <QRCodeCanvas value={enroll.uri} size={132} bgColor="#ffffff" fgColor="#111111" level="M" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-500">
                        Manuel giriş anahtarı
                      </p>
                      <p className="mt-1 break-all rounded-md border border-background-300 bg-background-50 px-2.5 py-1.5 font-mono text-[11px] text-foreground-800">
                        {enroll.secret}
                      </p>
                    </div>
                    <AccountField label="Doğrulama kodu" htmlFor="mfa-code">
                      <input
                        id="mfa-code"
                        value={code}
                        onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="123456"
                        className={`${accountInput} tracking-[0.4em]`}
                      />
                    </AccountField>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AccountButton onClick={verifyCode} loading={busy} icon="ri-check-line">
                    Doğrula ve Etkinleştir
                  </AccountButton>
                  <AccountButton onClick={() => void cancelEnroll()} variant="ghost">
                    Vazgeç
                  </AccountButton>
                </div>
              </div>
            ) : isActive ? (
              <div className="space-y-3">
                {verified.map((factor) => (
                  <div
                    key={factor.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-accent-200 bg-accent-50/60 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2 text-xs text-foreground-800">
                      <i className="ri-verified-badge-line text-base text-accent-700" />
                      <span className="font-semibold">{factor.friendlyName}</span>
                      <span className="text-foreground-500">· {formatDate(factor.createdAt)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => void disableFactor(factor.id)}
                      disabled={busy}
                      className="cursor-pointer whitespace-nowrap rounded-md border border-primary-300 px-2.5 py-1 text-[11px] font-semibold text-primary-800 hover:bg-primary-50 disabled:opacity-50"
                    >
                      Kapat
                    </button>
                  </div>
                ))}
                {pending.map((factor) => (
                  <div
                    key={factor.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-background-300 bg-background-50 px-3 py-2.5"
                  >
                    <p className="text-xs text-foreground-600">
                      <i className="ri-time-line mr-1" />
                      Tamamlanmamış kurulum: {factor.friendlyName}
                    </p>
                    <button
                      type="button"
                      onClick={() => void disableFactor(factor.id)}
                      className="cursor-pointer text-[11px] font-semibold text-foreground-600 hover:underline"
                    >
                      Kaldır
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="max-w-md text-xs leading-relaxed text-foreground-600">
                  Authenticator uygulaması ile QR kod eşleştirmesi yaparak 2FA'yı etkinleştirin. Kurulum 1 dakika sürer.
                </p>
                <AccountButton onClick={startEnroll} loading={busy} icon="ri-qr-scan-2-line">
                  Kurulumu Başlat
                </AccountButton>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-background-200 bg-background-100/60 p-4">
            <InlineAlert tone="info">
              {method === "sms"
                ? "SMS ile iki adımlı doğrulama için bir SMS gönderim sağlayıcısı (ör. NetGSM) bağlanması gerekiyor. Sağlayıcı bağlandığında kod gönderimi bu ekrandan çalışacak."
                : "E-posta ile iki adımlı doğrulama için e-posta gönderim servisinin (ör. Resend) kurulup doğrulanması gerekiyor. Kurulum tamamlanınca kod gönderimi bu ekrandan çalışacak."}
            </InlineAlert>
            <p className="mt-3 text-xs leading-relaxed text-foreground-600">
              Bu süre boyunca hesabınızı{" "}
              <strong className="font-semibold text-foreground-900">authenticator uygulaması</strong> ile koruyabilirsiniz
              — kurulum hemen tamamlanıyor.
            </p>
            <button
              type="button"
              onClick={() => setMethod("authenticator")}
              className="mt-3 inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-primary-700 hover:underline"
            >
              <i className="ri-arrow-right-line" />
              Authenticator kurulumuna geç
            </button>
          </div>
        )}

        {message && (
          <div className="mt-3">
            <InlineAlert tone="success">{message}</InlineAlert>
          </div>
        )}
        {error && (
          <div className="mt-3">
            <InlineAlert tone="error">{error}</InlineAlert>
          </div>
        )}
        {user?.last_sign_in_at && (
          <p className="mt-3 text-[11px] text-foreground-400">
            Son giriş: {formatDate(user.last_sign_in_at)} · {user.email}
          </p>
        )}
      </div>
    </AccountCard>
  );
}