import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { AccountButton, AccountCard, AccountField, InlineAlert, accountInput } from "@/components/base/AccountUI";
import { useAuth } from "@/context/AuthContext";
import { formatDate, initialsOf } from "@/lib/accountFormat";
import { supabase } from "@/lib/supabase";
import { uploadAvatar, validateAvatar } from "@/lib/avatar";

export default function ProfileTab() {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [emailSaving, setEmailSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState("");
  const [avatarError, setAvatarError] = useState("");

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setPhone(profile?.phone ?? "");
    setBirthDate(profile?.birth_date ?? "");
    setNewsletter(Boolean(profile?.newsletter));
  }, [profile]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    setMessage("");
    setError("");
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
        phone: phone.trim() || null,
        birth_date: birthDate || null,
        newsletter,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    if (updateError) setError("Bilgiler kaydedilemedi. Lütfen tekrar deneyin.");
    else {
      await refreshProfile();
      setMessage("Profil bilgileriniz güncellendi.");
    }
    setSaving(false);
  };

  const changeEmail = async () => {
    if (!newEmail.trim()) {
      setError("Yeni e-posta adresini girin.");
      return;
    }
    setEmailSaving(true);
    setError("");
    setMessage("");
    const { error: mailError } = await supabase.auth.updateUser({ email: newEmail.trim() });
    if (mailError) setError("E-posta güncellenemedi: " + mailError.message);
    else {
      setMessage("Doğrulama bağlantısı yeni adresinize gönderildi.");
      setNewEmail("");
    }
    setEmailSaving(false);
  };

  const pickAvatar = () => {
    fileRef.current?.click();
  };

  const handleAvatarFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !user) return;

    const invalid = validateAvatar(file);
    if (invalid) {
      setAvatarMessage("");
      setAvatarError(invalid);
      return;
    }

    setUploading(true);
    setAvatarError("");
    setAvatarMessage("");
    try {
      const url = await uploadAvatar(file, user.id);
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: url, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (updateError) throw new Error("Fotoğraf kaydedilemedi. Lütfen tekrar deneyin.");
      await refreshProfile();
      setAvatarMessage("Profil fotoğrafınız güncellendi.");
    } catch (uploadError) {
      setAvatarError(uploadError instanceof Error ? uploadError.message : "Fotoğraf yüklenemedi.");
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!user) return;
    setRemoving(true);
    setAvatarError("");
    setAvatarMessage("");
    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: null, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (updateError) throw updateError;
      await refreshProfile();
      setAvatarMessage("Profil fotoğrafı kaldırıldı.");
    } catch {
      setAvatarError("Fotoğraf kaldırılamadı. Lütfen tekrar deneyin.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="space-y-4">
      <AccountCard
        title="Profil Fotoğrafı"
        subtitle="Fotoğrafınız hesap menüsünde görünür."
        icon="ri-image-add-line"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-background-200 bg-background-100">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profil fotoğrafı" className="h-full w-full object-cover object-top" />
            ) : (
              <span className="font-heading text-xl font-bold text-foreground-500">
                {initialsOf(profile?.full_name, user?.email)}
              </span>
            )}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <AccountButton onClick={pickAvatar} loading={uploading} icon="ri-upload-2-line">
                Fotoğraf Yükle
              </AccountButton>
              {profile?.avatar_url && (
                <AccountButton onClick={() => void removeAvatar()} loading={removing} variant="ghost" icon="ri-delete-bin-6-line">
                  Kaldır
                </AccountButton>
              )}
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-foreground-400">
              JPG, PNG veya WEBP · en fazla 2 MB · kare fotoğraflar en iyi sonucu verir.
            </p>
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => void handleAvatarFile(event)}
          className="hidden"
        />

        {avatarMessage && (
          <div className="mt-3">
            <InlineAlert tone="success">{avatarMessage}</InlineAlert>
          </div>
        )}
        {avatarError && (
          <div className="mt-3">
            <InlineAlert tone="error">{avatarError}</InlineAlert>
          </div>
        )}
      </AccountCard>

      <AccountCard
        title="Kişisel Bilgiler"
        subtitle="Sipariş ve kargo süreçlerinde bu bilgiler kullanılır."
        icon="ri-user-3-line"
        action={<span className="text-[11px] text-foreground-400">Üyelik: {formatDate(profile?.created_at)}</span>}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AccountField label="Ad Soyad" htmlFor="profile-name">
            <input
              id="profile-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              maxLength={80}
              placeholder="Adınız Soyadınız"
              className={accountInput}
            />
          </AccountField>
          <AccountField label="Telefon" htmlFor="profile-phone" hint="Kargo bildirimleri için kullanılır.">
            <input
              id="profile-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              maxLength={20}
              placeholder="05xx xxx xx xx"
              className={accountInput}
            />
          </AccountField>
          <AccountField label="Doğum tarihi" htmlFor="profile-birth">
            <input
              id="profile-birth"
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              className={accountInput}
            />
          </AccountField>
          <AccountField label="E-posta" htmlFor="profile-email" hint="Giriş adresiniz, değiştirmek için aşağıyı kullanın.">
            <input
              id="profile-email"
              value={user?.email ?? profile?.email ?? ""}
              readOnly
              className={`${accountInput} cursor-not-allowed bg-background-100 text-foreground-500`}
            />
          </AccountField>
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-lg bg-background-100 px-3 py-2.5">
          <input
            type="checkbox"
            checked={newsletter}
            onChange={(event) => setNewsletter(event.target.checked)}
            className="mt-0.5 h-4 w-4 cursor-pointer accent-primary-700"
          />
          <span className="text-xs leading-relaxed text-foreground-700">
            Kampanya, indirim ve yeni ürün duyurularını e-posta ile almak istiyorum.
          </span>
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
          <AccountButton onClick={save} loading={saving} icon="ri-save-3-line">
            Bilgileri Kaydet
          </AccountButton>
        </div>
      </AccountCard>

      <AccountCard title="Giriş E-postası" subtitle="E-posta değişikliği her iki adrese doğrulama bağlantısı gönderir." icon="ri-mail-settings-line">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <AccountField label="Yeni e-posta adresi" htmlFor="profile-new-email">
              <input
                id="profile-new-email"
                type="email"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                placeholder="yeni@mail.com"
                className={accountInput}
              />
            </AccountField>
          </div>
          <AccountButton onClick={changeEmail} loading={emailSaving} variant="ghost" icon="ri-send-plane-line">
            Doğrulama Gönder
          </AccountButton>
        </div>
      </AccountCard>
    </div>
  );
}