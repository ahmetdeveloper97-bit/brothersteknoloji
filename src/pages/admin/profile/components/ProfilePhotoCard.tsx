import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Banner, Panel } from "@/components/base/AdminUI";
import { createAdminAvatar, validateAdminAvatar } from "@/lib/adminAvatar";
import { logActivity } from "@/lib/activity";
import { staffInitials, updateStaffProfile } from "@/lib/adminStaffStore";
import type { AdminStaff } from "@/types/adminRoles";

interface ProfilePhotoCardProps {
  staff: AdminStaff;
  onChanged: () => void;
}

export default function ProfilePhotoCard({ staff, onChanged }: ProfilePhotoCardProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const invalid = validateAdminAvatar(file);
    if (invalid) {
      setMessage("");
      setError(invalid);
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");
    try {
      const dataUrl = await createAdminAvatar(file);
      updateStaffProfile(staff.id, { avatarUrl: dataUrl });
      logActivity({
        category: "staff",
        action: "Profil fotoğrafını güncelledi",
        target: staff.name,
        detail: "Yönetici profil fotoğrafı değiştirildi",
      });
      setMessage("Profil fotoğrafınız güncellendi.");
      onChanged();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Fotoğraf yüklenemedi.");
    } finally {
      setBusy(false);
    }
  };

  const removePhoto = () => {
    updateStaffProfile(staff.id, { avatarUrl: undefined });
    setMessage("Profil fotoğrafı kaldırıldı.");
    setError("");
    onChanged();
  };

  return (
    <Panel title="Profil Fotoğrafı" subtitle="Sağ üstteki hesap menüsünde ve yorum yanıtlarında görünür." icon="ri-image-add-line">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-background-200 bg-primary-100 dark:bg-primary-200">
          {staff.avatarUrl ? (
            <img src={staff.avatarUrl} alt={`${staff.name} profil fotoğrafı`} className="h-full w-full object-cover object-top" />
          ) : (
            <span className="font-heading text-xl font-bold text-primary-800 dark:text-primary-950">
              {staffInitials(staff.name)}
            </span>
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-background-50 hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <i className={busy ? "ri-loader-4-line animate-spin" : "ri-upload-2-line"} />
              {busy ? "Yükleniyor..." : "Fotoğraf Yükle"}
            </button>
            {staff.avatarUrl && (
              <button
                type="button"
                onClick={removePhoto}
                className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-3 py-2 text-sm font-semibold text-foreground-800 hover:bg-background-100"
              >
                <i className="ri-delete-bin-6-line" />
                Kaldır
              </button>
            )}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-foreground-500">
            JPG, PNG veya WEBP · en fazla 3 MB · kare fotoğraflar en iyi sonucu verir. Yüklediğiniz fotoğraf otomatik olarak
            kırpılıp küçültülür.
          </p>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => void handleFile(event)}
        className="hidden"
      />

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
    </Panel>
  );
}