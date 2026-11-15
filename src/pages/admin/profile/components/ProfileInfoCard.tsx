import { useEffect, useState } from "react";
import { Banner, Field, Panel, Toggle, inputClass, textareaClass } from "@/components/base/AdminUI";
import { logActivity } from "@/lib/activity";
import { setStaffName, updateStaffProfile } from "@/lib/adminStaffStore";
import { TR_CITIES } from "@/lib/trCities";
import type { AdminStaff } from "@/types/adminRoles";

interface ProfileInfoCardProps {
  staff: AdminStaff;
  onChanged: () => void;
}

export default function ProfileInfoCard({ staff, onChanged }: ProfileInfoCardProps) {
  const [name, setName] = useState(staff.name);
  const [phone, setPhone] = useState(staff.phone);
  const [jobTitle, setJobTitle] = useState(staff.jobTitle ?? "");
  const [city, setCity] = useState(staff.city ?? "");
  const [bio, setBio] = useState(staff.bio ?? "");
  const [notifyEmail, setNotifyEmail] = useState(staff.notifyEmail ?? true);
  const [notifyTasks, setNotifyTasks] = useState(staff.notifyTasks ?? true);
  const [notifySms, setNotifySms] = useState(staff.notifySms ?? false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(staff.name);
    setPhone(staff.phone);
    setJobTitle(staff.jobTitle ?? "");
    setCity(staff.city ?? "");
    setBio(staff.bio ?? "");
    setNotifyEmail(staff.notifyEmail ?? true);
    setNotifyTasks(staff.notifyTasks ?? true);
    setNotifySms(staff.notifySms ?? false);
  }, [staff]);

  const save = () => {
    setMessage("");
    setError("");
    if (!name.trim()) {
      setError("Ad soyad alanı boş bırakılamaz.");
      return;
    }
    if (bio.length > 280) {
      setError("Kısa not en fazla 280 karakter olabilir.");
      return;
    }

    setSaving(true);
    setStaffName(staff.id, name);
    updateStaffProfile(staff.id, {
      phone: phone.trim(),
      jobTitle: jobTitle.trim(),
      city: city.trim(),
      bio: bio.trim(),
      notifyEmail,
      notifyTasks,
      notifySms,
    });
    logActivity({
      category: "staff",
      action: "Profil bilgilerini güncelledi",
      target: name.trim(),
      detail: "Kişisel bilgiler ve bildirim tercihleri kaydedildi",
    });
    setSaving(false);
    setMessage("Profil bilgileriniz kaydedildi.");
    onChanged();
  };

  const emailLocked = true;

  return (
    <Panel
      title="Kişisel Bilgiler"
      subtitle="Bu bilgiler panel içi iletişimde ve görev bildirimlerinde kullanılır."
      icon="ri-user-3-line"
      action={<span className="text-[11px] text-foreground-500">Giriş: {staff.email}</span>}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Ad Soyad">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            placeholder="Adınız Soyadınız"
            className={inputClass}
          />
        </Field>

        <Field label="Telefon" hint="Görev bildirimleri ve acil iletişim için.">
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            maxLength={20}
            placeholder="05xx xxx xx xx"
            className={inputClass}
          />
        </Field>

        <Field label="Görev unvanı" hint="Örn. Kıdemli Satış Temsilcisi">
          <input
            value={jobTitle}
            onChange={(event) => setJobTitle(event.target.value)}
            maxLength={60}
            placeholder="Görev unvanınız"
            className={inputClass}
          />
        </Field>

        <Field label="Şehir">
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            maxLength={40}
            placeholder="İstanbul"
            list="staff-city-options"
            className={inputClass}
          />
          <datalist id="staff-city-options">
            {TR_CITIES.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Giriş e-postası" hint="Giriş adresi genel yönetici tarafından değiştirilebilir.">
            <div className="flex items-center gap-2">
              <input
                value={staff.email}
                readOnly={emailLocked}
                className={`${inputClass} cursor-not-allowed bg-background-100 text-foreground-500`}
              />
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background-100 text-foreground-400">
                <i className="ri-lock-line" />
              </span>
            </div>
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Kısa not" hint={`${bio.length}/280 karakter`}>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value.slice(0, 280))}
              rows={3}
              placeholder="Ekip arkadaşlarınızın sizi tanıması için kısa bir not..."
              className={textareaClass}
            />
          </Field>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-background-200 bg-background-100/60 p-3.5">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-foreground-800">
          <i className="ri-notification-3-line text-primary-700" />
          Bildirim tercihleri
        </p>
        <div className="space-y-3">
          <Toggle
            checked={notifyEmail}
            onChange={setNotifyEmail}
            label="E-posta bildirimleri"
            description="Yeni sipariş, iade talebi ve yönetici hareketleri e-posta ile gelsin."
          />
          <Toggle
            checked={notifyTasks}
            onChange={setNotifyTasks}
            label="Görev bildirimleri"
            description="Kargoya verilen siparişlerden doğan destek görevleri panelde öne çıkarılsın."
          />
          <Toggle
            checked={notifySms}
            onChange={setNotifySms}
            label="SMS bildirimleri"
            description="Kritik durumlarda kayıtlı telefonunuza kısa mesaj gönderilsin."
          />
        </div>
      </div>

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

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg bg-primary-700 px-5 py-2 text-sm font-semibold text-background-50 hover:bg-primary-800 disabled:opacity-60"
        >
          <i className="ri-save-3-line" />
          Bilgileri Kaydet
        </button>
      </div>
    </Panel>
  );
}