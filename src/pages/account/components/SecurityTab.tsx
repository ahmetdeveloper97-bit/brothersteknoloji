import { useState } from "react";
import { AccountButton, AccountCard, AccountField, InlineAlert, accountInput } from "@/components/base/AccountUI";
import TwoFactorSection from "@/pages/account/components/TwoFactorSection";
import { useAuth } from "@/context/AuthContext";
import { formatDateTime } from "@/lib/accountFormat";
import { supabase } from "@/lib/supabase";

export default function SecurityTab() {
  const { user, signOut } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const appMetadata = user?.app_metadata as { providers?: string[] } | undefined;
  const hasPasswordProvider = Boolean(
    user?.identities?.some((identity) => identity.provider === "email") || appMetadata?.providers?.includes("email"),
  );

  const updatePassword = async () => {
    setError("");
    setMessage("");
    if (newPassword.length < 8) {
      setError("Yeni şifre en az 8 karakter olmalı.");
      return;
    }
    if (newPassword !== repeatPassword) {
      setError("Yeni şifreler birbiriyle eşleşmiyor.");
      return;
    }
    if (hasPasswordProvider && !currentPassword) {
      setError("Mevcut şifrenizi girin.");
      return;
    }

    setSaving(true);
    try {
      if (hasPasswordProvider && user?.email) {
        const { error: reauthError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });
        if (reauthError) {
          setError("Mevcut şifreniz doğrulanamadı.");
          setSaving(false);
          return;
        }
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) {
        setError(updateError.message);
      } else {
        setMessage("Şifreniz güncellendi. Diğer cihazlardaki oturumlar etkilenmez.");
        setCurrentPassword("");
        setNewPassword("");
        setRepeatPassword("");
      }
    } catch {
      setError("Şifre güncellenemedi. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <AccountCard
        title={hasPasswordProvider ? "Şifre Güncelle" : "Şifre Belirle"}
        subtitle={
          hasPasswordProvider
            ? "Güvenli bir şifre için en az 8 karakter, harf ve rakam kullanın."
            : "Sosyal hesapla giriş yaptınız. Bir şifre belirleyerek e-posta ile de giriş yapabilirsiniz."
        }
        icon="ri-lock-password-line"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {hasPasswordProvider && (
            <div className="sm:col-span-2">
              <AccountField label="Mevcut şifre" htmlFor="sec-current">
                <input
                  id="sec-current"
                  type={show ? "text" : "password"}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={accountInput}
                />
              </AccountField>
            </div>
          )}
          <AccountField label="Yeni şifre" htmlFor="sec-new">
            <input
              id="sec-new"
              type={show ? "text" : "password"}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="En az 8 karakter"
              className={accountInput}
            />
          </AccountField>
          <AccountField label="Yeni şifre (tekrar)" htmlFor="sec-repeat">
            <input
              id="sec-repeat"
              type={show ? "text" : "password"}
              value={repeatPassword}
              onChange={(event) => setRepeatPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="En az 8 karakter"
              className={accountInput}
            />
          </AccountField>
        </div>

        <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-foreground-700">
          <input
            type="checkbox"
            checked={show}
            onChange={(event) => setShow(event.target.checked)}
            className="h-4 w-4 cursor-pointer accent-primary-700"
          />
          Şifreleri göster
        </label>

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

        <div className="mt-4 flex justify-end">
          <AccountButton onClick={updatePassword} loading={saving} icon="ri-lock-2-line">
            Şifreyi Güncelle
          </AccountButton>
        </div>
      </AccountCard>

      <TwoFactorSection />

      <AccountCard title="Oturum" subtitle="Hesabınıza bağlı aktif oturum bilgisi." icon="ri-device-line">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-background-200 bg-background-100/60 px-3 py-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground-900">{user?.email ?? "—"}</p>
            <p className="mt-0.5 text-[11px] text-foreground-500">
              Bu cihazdaki oturum · Son giriş: {formatDateTime(user?.last_sign_in_at)}
            </p>
          </div>
          <AccountButton variant="danger" onClick={() => void signOut()} icon="ri-logout-box-r-line">
            Oturumu Kapat
          </AccountButton>
        </div>
      </AccountCard>
    </div>
  );
}