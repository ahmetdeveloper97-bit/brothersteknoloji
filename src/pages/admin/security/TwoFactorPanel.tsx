import { useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Banner, Field, Panel, Pill, inputClass } from "@/components/base/AdminUI";
import { buildOtpAuthUri, generateTotpSecret, totpSecondsRemaining, verifyTotpCode } from "@/lib/totp";
import { clearStaffTwoFactor, loadStaff, refreshStaff, setStaffTwoFactor } from "@/lib/adminStaffStore";
import { formatActivityMoment, logActivity } from "@/lib/activity";
import { roleLabels } from "@/lib/adminRoles";
import type { AdminStaff } from "@/types/adminRoles";

interface TwoFactorPanelProps {
  staff: AdminStaff;
  onChanged: () => void;
}

type Method = "authenticator" | "sms" | "email";

const methods: { id: Method; label: string; description: string; icon: string; available: boolean }[] = [
  {
    id: "authenticator",
    label: "Authenticator uygulaması",
    description: "Google Authenticator, Authy veya Microsoft Authenticator ile 6 haneli kod üretin.",
    icon: "ri-smartphone-line",
    available: true,
  },
  {
    id: "sms",
    label: "SMS ile kod",
    description: "Girişte kayıtlı telefona tek kullanımlık kod gönderilir.",
    icon: "ri-message-2-line",
    available: false,
  },
  {
    id: "email",
    label: "E-posta ile kod",
    description: "Girişte e-posta adresine tek kullanımlık kod gönderilir.",
    icon: "ri-mail-lock-line",
    available: false,
  },
];

const ISSUER = "Brothers Teknoloji Admin";

export default function TwoFactorPanel({ staff, onChanged }: TwoFactorPanelProps) {
  const [method, setMethod] = useState<Method>("authenticator");
  const [enroll, setEnroll] = useState<{ secret: string; uri: string } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(() => totpSecondsRemaining());
  const [team, setTeam] = useState<AdminStaff[]>(() => loadStaff());

  const active = Boolean(staff.twoFactorEnabled && staff.twoFactorSecret);
  const isManager = staff.roles.includes("yonetici");

  useEffect(() => {
    setEnroll(null);
    setCode("");
    setError("");
    setMessage("");
  }, [staff.id]);

  useEffect(() => {
    const timer = window.setInterval(() => setSecondsLeft(totpSecondsRemaining()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void refreshStaff().then((list) => {
      if (!cancelled) setTeam(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshTeam = () => {
    void refreshStaff().then((list) => setTeam(list));
  };

  const teamWithTwoFactor = useMemo(
    () => team.filter((member) => member.id !== staff.id && member.twoFactorEnabled),
    [team, staff.id],
  );

  const startEnroll = () => {
    setError("");
    setMessage("");
    const secret = generateTotpSecret();
    setEnroll({ secret, uri: buildOtpAuthUri(ISSUER, staff.email, secret) });
    setCode("");
  };

  const cancelEnroll = () => {
    setEnroll(null);
    setCode("");
    setError("");
    setMessage("");
  };

  const confirmEnroll = async () => {
    if (!enroll) return;
    if (code.replace(/\D/g, "").length !== 6) {
      setError("6 haneli doğrulama kodunu girin.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const valid = await verifyTotpCode(enroll.secret, code);
      if (!valid) {
        setError("Kod doğrulanamadı. Uygulamadaki güncel kodu girip tekrar deneyin.");
        return;
      }
      const saved = await setStaffTwoFactor(staff.id, enroll.secret);
      if (!saved.ok) {
        setError(saved.message ?? "İki adımlı doğrulama kaydedilemedi.");
        return;
      }
      logActivity({
        category: "security",
        action: "İki adımlı doğrulamayı açtı",
        target: "Yönetici hesabı",
        detail: `${staff.email} · authenticator uygulaması ile 2FA etkinleştirildi`,
      });
      setEnroll(null);
      setCode("");
      setMessage("İki adımlı doğrulama etkinleştirildi. Sonraki girişlerde kod istenecek.");
      refreshTeam();
      onChanged();
    } catch {
      setError("Doğrulama sırasında bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  };

  const disableOwn = async () => {
    const result = await clearStaffTwoFactor(staff.id);
    if (!result.ok) {
      setError(result.message ?? "İşlem tamamlanamadı.");
      return;
    }
    logActivity({
      category: "security",
      action: "İki adımlı doğrulamayı kapattı",
      target: "Yönetici hesabı",
      detail: `${staff.email} · 2FA devre dışı bırakıldı`,
    });
    setMessage("İki adımlı doğrulama kapatıldı. Girişte artık kod istenmeyecek.");
    setError("");
    refreshTeam();
    onChanged();
  };

  const resetMember = async (member: AdminStaff) => {
    const result = await clearStaffTwoFactor(member.id);
    if (!result.ok) {
      setError(result.message ?? "İşlem tamamlanamadı.");
      return;
    }
    logActivity({
      category: "security",
      action: "Personelin 2FA kaydını sıfırladı",
      target: member.name,
      detail: `${member.email} için authenticator eşleştirmesi kaldırıldı`,
    });
    setMessage(`${member.name} için iki adımlı doğrulama sıfırlandı. Kişi kendi ekranından yeniden kurabilir.`);
    refreshTeam();
    onChanged();
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <div className="space-y-4 xl:col-span-2">
        <Panel
          title="İki Adımlı Doğrulama (2FA)"
          subtitle="Şifrenizin ötesinde ikinci bir güvenlik katmanı ekleyin"
          icon="ri-shield-keyhole-line"
          action={<Pill tone={active ? "success" : "neutral"}>{active ? "Aktif" : "Kapalı"}</Pill>}
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
                      ? "border-primary-400 bg-primary-50 ring-1 ring-primary-300"
                      : "border-background-200 bg-background-50 hover:border-background-300"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <i className={`${item.icon} text-base ${selected ? "text-primary-700" : "text-foreground-600"}`} />
                    <span className="text-xs font-bold text-foreground-950">{item.label}</span>
                    {!item.available && (
                      <span className="ml-auto rounded-full bg-secondary-100 px-1.5 py-0.5 text-[9px] font-bold text-secondary-900">
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
                {enroll ? (
                  <div className="space-y-4">
                    <p className="text-xs leading-relaxed text-foreground-700">
                      Aşağıdaki QR kodu authenticator uygulamanızla okutun, ardından uygulamanın gösterdiği 6 haneli
                      kodu girin.
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

                        <Field label="Doğrulama kodu" hint={`Kodun yenilenmesine ${secondsLeft} saniye`}>
                          <input
                            value={code}
                            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="123456"
                            className={`${inputClass} tracking-[0.4em]`}
                          />
                        </Field>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => void confirmEnroll()}
                        disabled={busy}
                        className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-background-50 hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <i className={busy ? "ri-loader-4-line animate-spin" : "ri-check-line"} />
                        Doğrula ve Etkinleştir
                      </button>
                      <button
                        type="button"
                        onClick={cancelEnroll}
                        className="cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 py-2 text-sm font-semibold text-foreground-800 hover:bg-background-100"
                      >
                        Vazgeç
                      </button>
                    </div>
                  </div>
                ) : active ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-accent-300 bg-accent-50 px-3 py-2.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-800">
                        <i className="ri-verified-badge-line text-base text-accent-700" />
                        <span className="font-semibold">Authenticator uygulaması</span>
                        {staff.twoFactorEnabledAt && (
                          <span className="text-foreground-500">· {formatActivityMoment(staff.twoFactorEnabledAt)}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={disableOwn}
                        className="cursor-pointer whitespace-nowrap rounded-md border border-primary-300 px-2.5 py-1 text-[11px] font-semibold text-primary-800 hover:bg-primary-50"
                      >
                        Kapat
                      </button>
                    </div>
                    <p className="text-[11px] leading-relaxed text-foreground-500">
                      Bu hesapta giriş yaparken şifreden sonra 6 haneli kod isteniyor. Telefonunuzu kaybederseniz genel
                      yönetici kaydınızı sıfırlayabilir.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="max-w-md text-xs leading-relaxed text-foreground-600">
                      Authenticator uygulaması ile QR eşleştirmesi yaparak 2FA'yı etkinleştirin. Kurulum yaklaşık 1
                      dakika sürer.
                    </p>
                    <button
                      type="button"
                      onClick={startEnroll}
                      className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-background-50 hover:bg-primary-800"
                    >
                      <i className="ri-qr-scan-2-line" />
                      Kurulumu Başlat
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-background-200 bg-background-100/60 p-4">
                <Banner tone="info">
                  {method === "sms"
                    ? "SMS ile iki adımlı doğrulama için bir SMS gönderim sağlayıcısı (ör. NetGSM) bağlanması gerekiyor. Sağlayıcı bağlandığında kod gönderimi bu ekrandan çalışacak."
                    : "E-posta ile iki adımlı doğrulama için e-posta gönderim servisinin (ör. Resend) kurulup doğrulanması gerekiyor. Kurulum tamamlanınca kod gönderimi bu ekrandan çalışacak."}
                </Banner>
                <p className="mt-3 text-xs leading-relaxed text-foreground-600">
                  Bu süre boyunca hesabınızı <strong className="font-semibold text-foreground-900">authenticator uygulaması</strong>{" "}
                  ile koruyabilirsiniz — kurulum hemen tamamlanıyor.
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
                <Banner tone="success">{message}</Banner>
              </div>
            )}
            {error && (
              <div className="mt-3">
                <Banner tone="warning">{error}</Banner>
              </div>
            )}
          </div>
        </Panel>

        {isManager && (
          <Panel
            title="Ekip 2FA Durumu"
            subtitle="Telefonunu kaybeden personelin doğrulama kaydını buradan sıfırlayın"
            icon="ri-team-line"
          >
            {teamWithTwoFactor.length === 0 ? (
              <p className="text-xs leading-relaxed text-foreground-500">
                Şu anda sizin dışınızda 2FA kullanan bir yönetici yok. Personel kendi ekranından kurulum yaptığında
                burada listelenir.
              </p>
            ) : (
              <div className="space-y-2">
                {teamWithTwoFactor.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-background-200 bg-background-50 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground-950">{member.name}</p>
                      <p className="truncate text-[11px] text-foreground-500">
                        {member.email} · {roleLabels(member.roles).join(" + ")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => resetMember(member)}
                      className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border border-background-300 px-2.5 py-1 text-[11px] font-semibold text-foreground-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800"
                    >
                      <i className="ri-lock-unlock-line" />
                      2FA'yı Sıfırla
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-3 flex items-center gap-1.5 text-[11px] leading-relaxed text-foreground-400">
              <i className="ri-history-line" />
              Her sıfırlama işlemi İşlem Geçmişi ekranına kaydedilir.
            </p>
          </Panel>
        )}
      </div>

      <div className="space-y-4">
        <Panel title="Hesap" subtitle="Doğrulama bu hesaba bağlanır" icon="ri-user-3-line">
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-foreground-500">Ad Soyad</span>
              <span className="truncate font-semibold text-foreground-950">{staff.name}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-foreground-500">E-posta</span>
              <span className="truncate font-semibold text-foreground-950">{staff.email}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground-500">Roller</span>
              <span className="text-right font-semibold text-foreground-950">{roleLabels(staff.roles).join(" + ")}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-foreground-500">Durum</span>
              <Pill tone={active ? "success" : "warning"}>{active ? "2FA korumalı" : "Yalnızca şifre"}</Pill>
            </div>
          </div>
        </Panel>

        <Panel title="Nasıl çalışır?" icon="ri-question-line">
          <ol className="space-y-2.5 text-[11px] leading-relaxed text-foreground-600">
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-800">
                1
              </span>
              Telefonunuza Google Authenticator, Authy veya Microsoft Authenticator kurun.
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-800">
                2
              </span>
              Kurulumu başlatıp QR kodu uygulamayla okutun.
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-800">
                3
              </span>
              Uygulamanın gösterdiği 6 haneli kodu girerek etkinleştirin.
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-800">
                4
              </span>
              Sonraki girişlerde şifreden sonra bu kod istenir.
            </li>
          </ol>
        </Panel>
      </div>
    </div>
  );
}