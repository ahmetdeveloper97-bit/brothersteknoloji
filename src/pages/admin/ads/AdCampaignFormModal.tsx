import { useState } from "react";
import Modal from "@/components/base/Modal";
import { Field, inputClass } from "@/components/base/AdminUI";
import { AD_CHANNELS, AD_OBJECTIVES, formatMoney, platformLabel } from "@/lib/ads";
import type { AdPlatform, NewAdCampaignInput } from "@/types/ads";

interface AdCampaignFormModalProps {
  open: boolean;
  defaultPlatform: AdPlatform;
  monthlyLimit: number;
  onClose: () => void;
  onSave: (input: NewAdCampaignInput) => void;
}

const today = (): string => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

export default function AdCampaignFormModal({
  open,
  defaultPlatform,
  monthlyLimit,
  onClose,
  onSave,
}: AdCampaignFormModalProps) {
  const [platform, setPlatform] = useState<AdPlatform>(defaultPlatform);
  const [name, setName] = useState("");
  const [channel, setChannel] = useState(AD_CHANNELS[defaultPlatform][0]);
  const [objective, setObjective] = useState(AD_OBJECTIVES[0]);
  const [dailyBudget, setDailyBudget] = useState(400);
  const [startDate, setStartDate] = useState(today());
  const [status, setStatus] = useState<"active" | "draft">("active");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const switchPlatform = (next: AdPlatform) => {
    setPlatform(next);
    setChannel(AD_CHANNELS[next][0]);
    setError("");
  };

  const monthlyProjection = dailyBudget * 30;

  const reset = () => {
    setPlatform(defaultPlatform);
    setName("");
    setChannel(AD_CHANNELS[defaultPlatform][0]);
    setObjective(AD_OBJECTIVES[0]);
    setDailyBudget(400);
    setStartDate(today());
    setStatus("active");
    setError("");
    setSaved(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const save = () => {
    if (!name.trim()) {
      setError("Kampanya adı zorunludur.");
      return;
    }
    if (dailyBudget <= 0) {
      setError("Günlük bütçe sıfırdan büyük olmalıdır.");
      return;
    }
    if (!startDate) {
      setError("Başlangıç tarihi seçmelisiniz.");
      return;
    }
    onSave({
      platform,
      name: name.trim(),
      channel,
      objective,
      dailyBudget,
      startDate,
      status,
    });
    setSaved(true);
  };

  if (saved) {
    return (
      <Modal
        open={open}
        title="Kampanya oluşturuldu"
        subtitle={`${platformLabel[platform]} · ${channel} kanalı`}
        icon="ri-checkbox-circle-line"
        onClose={close}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className="h-9 cursor-pointer whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700"
            >
              Tamam
            </button>
          </div>
        }
      >
        <div className="space-y-2.5">
          <p className="text-sm text-foreground-800">
            <strong>{name.trim()}</strong> kampanyası {status === "active" ? "yayına alındı" : "taslak olarak kaydedildi"}.
          </p>
          <div className="space-y-1.5 rounded-lg bg-background-100 p-3 text-xs text-foreground-700">
            <p className="flex items-center justify-between">
              <span>Kanal</span>
              <span className="font-semibold text-foreground-950">{channel}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Hedef</span>
              <span className="font-semibold text-foreground-950">{objective}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Günlük bütçe</span>
              <span className="font-semibold text-foreground-950">{formatMoney(dailyBudget)}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Başlangıç</span>
              <span className="font-semibold text-foreground-950">{startDate.split("-").reverse().join(".")}</span>
            </p>
          </div>
          <p className="text-[11px] leading-relaxed text-foreground-500">
            Aylık tahmini harcama {formatMoney(monthlyProjection)} · tanımlı aylık limit {formatMoney(monthlyLimit)}. Limit
            aşılırsa reklam panelinde uyarı şeridi görünür.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      title="Yeni Reklam Kampanyası"
      subtitle="Kanal, bütçe ve hedefi seçerek kampanya taslağı oluşturun"
      icon="ri-megaphone-line"
      onClose={close}
      maxWidth="max-w-xl"
      footer={
        <div className="flex items-center justify-between gap-2">
          <span className="hidden text-[11px] text-foreground-500 sm:block">
            Aylık tahmini {formatMoney(monthlyProjection)}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={close}
              className="h-9 cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium text-foreground-700 hover:bg-background-100"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={save}
              className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700"
            >
              <i className="ri-add-line" />
              Kampanyayı oluştur
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-3.5">
        {error && (
          <p className="flex items-center gap-2 rounded-lg border border-foreground-300 bg-foreground-100 px-3 py-2 text-xs text-foreground-900">
            <i className="ri-error-warning-line" />
            {error}
          </p>
        )}

        <Field label="Reklam platformu">
          <div className="grid grid-cols-2 gap-2">
            {(["google", "meta"] as AdPlatform[]).map((item) => {
              const active = platform === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => switchPlatform(item)}
                  className={`flex h-10 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border text-xs font-semibold transition-colors ${
                    active
                      ? "border-primary-400 bg-primary-100 text-primary-900"
                      : "border-background-300 bg-background-50 text-foreground-600 hover:bg-background-100"
                  }`}
                >
                  <i className={item === "google" ? "ri-google-fill" : "ri-meta-fill"} />
                  {platformLabel[item]}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Kampanya adı *">
          <input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
            placeholder="Örn. Kasım İndirimi · Elektronik"
            className={inputClass}
            maxLength={70}
          />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Kanal">
            <select value={channel} onChange={(event) => setChannel(event.target.value)} className={inputClass}>
              {AD_CHANNELS[platform].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Kampanya hedefi">
            <select value={objective} onChange={(event) => setObjective(event.target.value)} className={inputClass}>
              {AD_OBJECTIVES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Günlük bütçe (₺)" hint={`Aylık tahmini ${formatMoney(monthlyProjection)}`}>
            <input
              type="number"
              min={0}
              step={50}
              value={dailyBudget}
              onChange={(event) => {
                setDailyBudget(Math.max(0, Number(event.target.value) || 0));
                setError("");
              }}
              className={inputClass}
            />
          </Field>
          <Field label="Başlangıç tarihi">
            <input
              type="date"
              value={startDate}
              onChange={(event) => {
                setStartDate(event.target.value);
                setError("");
              }}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[250, 500, 1000, 2000].map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setDailyBudget(amount)}
              className={`h-8 cursor-pointer whitespace-nowrap rounded-full border px-3 text-[11px] font-semibold transition-colors ${
                dailyBudget === amount
                  ? "border-primary-400 bg-primary-100 text-primary-900"
                  : "border-background-300 text-foreground-600 hover:bg-background-100"
              }`}
            >
              {formatMoney(amount)}/gün
            </button>
          ))}
        </div>

        <Field label="Yayın durumu">
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "active" as const, label: "Hemen yayına al", icon: "ri-play-circle-line" },
              { key: "draft" as const, label: "Taslak olarak kaydet", icon: "ri-draft-line" },
            ].map((option) => {
              const active = status === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setStatus(option.key)}
                  className={`flex h-10 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border text-xs font-medium transition-colors ${
                    active
                      ? "border-accent-400 bg-accent-50 text-accent-900"
                      : "border-background-300 bg-background-50 text-foreground-600 hover:bg-background-100"
                  }`}
                >
                  <i className={option.icon} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="rounded-lg bg-background-100 p-3">
          <p className="text-[11px] leading-relaxed text-foreground-600">
            <i className="ri-information-line mr-1" />
            Bu panelde oluşturulan kampanya yerel olarak kaydedilir. Canlı yayına almak için ilgili reklam hesabı API
            bağlantısının tamamlanması gerekir.
          </p>
        </div>
      </div>
    </Modal>
  );
}