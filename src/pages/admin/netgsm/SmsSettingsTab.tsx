import { useState } from "react";
import { Banner, Field, Panel, Toggle, inputClass } from "@/components/base/AdminUI";
import type { NetgsmSettings } from "@/types/integrations";

interface SmsSettingsTabProps {
  settings: NetgsmSettings;
  onSettings: (patch: Partial<NetgsmSettings>) => void;
}

export default function SmsSettingsTab({ settings, onSettings }: SmsSettingsTabProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [test, setTest] = useState<null | "ok" | "error">(null);

  const runTest = () => {
    if (settings.usercode.trim().length < 6 || settings.password.trim().length < 4) {
      setTest("error");
      return;
    }
    setTest("ok");
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Panel title="NetGSM API Bağlantısı" subtitle="Kurumsal SMS hesap bilgileri" icon="ri-plug-line">
        <div className="space-y-4">
          {test === "ok" && (
            <Banner tone="success" onClose={() => setTest(null)}>
              Bağlantı doğrulandı · {settings.header} başlığı aktif · kalan kontör {settings.balance}
            </Banner>
          )}
          {test === "error" && (
            <Banner tone="danger" onClose={() => setTest(null)}>
              Kullanıcı kodu veya şifre eksik. NetGSM paneli bilgilerinizi kontrol edin.
            </Banner>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Kullanıcı kodu (usercode)">
              <input
                value={settings.usercode}
                onChange={(event) => onSettings({ usercode: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Şifre">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={settings.password}
                  onChange={(event) => onSettings({ password: event.target.value })}
                  className={`${inputClass} pr-9`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label="Şifreyi göster"
                  className="absolute right-0 top-0 flex h-10 w-9 cursor-pointer items-center justify-center text-foreground-500"
                >
                  <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"} />
                </button>
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Mesaj başlığı (msgheader)" hint="NetGSM'de onaylı başlık olmalı.">
              <input
                value={settings.header}
                onChange={(event) => onSettings({ header: event.target.value.toUpperCase() })}
                className={inputClass}
              />
            </Field>
            <Field label="Gönderici adı">
              <input
                value={settings.senderName}
                onChange={(event) => onSettings({ senderName: event.target.value })}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="space-y-3 rounded-lg bg-background-100 p-3">
            <Toggle
              checked={settings.enabled}
              onChange={(value) => onSettings({ enabled: value })}
              label="SMS gönderimi aktif"
              description="Kapalıyken gönderimler kuyruğa alınır."
            />
            <Toggle
              checked={settings.iysFilter}
              onChange={(value) => onSettings({ iysFilter: value })}
              label="İYS filtresini uygula"
              description="Ticari mesajlar yalnızca onaylı kişilere gider."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={runTest}
              className="flex h-10 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-sm font-semibold text-background-50 hover:bg-primary-700"
            >
              <i className="ri-link" />
              Bağlantıyı Test Et
            </button>
            <button
              type="button"
              onClick={() => onSettings({ balance: settings.balance + 1000 })}
              className="flex h-10 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-4 text-sm font-semibold text-foreground-800 hover:bg-background-100"
            >
              <i className="ri-add-circle-line" />
              1.000 Kontör Yükle
            </button>
          </div>
        </div>
      </Panel>

      <div className="space-y-4">
        <Panel title="Kontör Durumu" icon="ri-wallet-3-line">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-heading text-3xl font-bold text-foreground-950">{settings.balance}</p>
              <p className="text-xs text-foreground-500">kalan SMS kontörü</p>
            </div>
            <span className="rounded-lg bg-accent-100 px-2.5 py-1 text-[11px] font-semibold text-accent-900">
              {settings.enabled ? "Aktif" : "Pasif"}
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-background-200">
            <div
              className="h-full rounded-full bg-accent-500"
              style={{ width: `${Math.min(100, Math.round((settings.balance / 6000) * 100))}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-foreground-500">Aylık ortalama tüketim: 1.180 kontör</p>
        </Panel>

        <Panel title="Entegrasyon Notları" icon="ri-information-line">
          <ul className="space-y-2 text-[11px] leading-relaxed text-foreground-600">
            {[
              "NetGSM REST API çağrıları güvenli sunucu tarafında yapılmalıdır; panelde saklanan şifre tarayıcıda tutulmaz.",
              "Başlık (msgheader) NetGSM panelinde onaylı olmalı, aksi halde gönderim reddedilir.",
              "Ticari SMS'lerde İYS onayı zorunludur; onaysız numaralar filtrelenir.",
              "Teslimat raporları NetGSM'den çekilerek bu ekranda güncellenir.",
            ].map((note) => (
              <li key={note} className="flex gap-2">
                <i className="ri-check-line mt-0.5 text-accent-600" />
                {note}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}