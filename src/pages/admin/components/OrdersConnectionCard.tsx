import { useEffect, useState } from "react";
import {
  generatePanelKey,
  panelKeyExists,
  panelListOrders,
  panelSetupKey,
  readPanelKey,
  writePanelKey,
} from "@/lib/panelOrders";

interface OrdersConnectionCardProps {
  onConnected: (key: string) => void;
  invalidKey?: boolean;
}

let autoAttempted = false;

export default function OrdersConnectionCard({ onConnected, invalidKey = false }: OrdersConnectionCardProps) {
  const [mode, setMode] = useState<"idle" | "existing">("idle");
  const [busy, setBusy] = useState(false);
  const [createdKey, setCreatedKey] = useState("");
  const [existingKey, setExistingKey] = useState("");
  const [message, setMessage] = useState("");
  const [showLocalKey, setShowLocalKey] = useState(false);
  const localKey = readPanelKey();

  const createConnection = async () => {
    setBusy(true);
    setMessage("");
    setCreatedKey("");

    const exists = await panelKeyExists();
    if (exists.ok && exists.data?.configured) {
      setMode("existing");
      setBusy(false);
      setMessage("Bu mağaza için bir panel anahtarı zaten oluşturulmuş. Mevcut anahtarı girin.");
      return;
    }

    const key = generatePanelKey();
    const result = await panelSetupKey(key);
    if (result.ok) {
      writePanelKey(key);
      setCreatedKey(key);
      setMode("idle");
      onConnected(key);
    } else {
      setMessage(result.message || "Bağlantı kurulamadı.");
    }
    setBusy(false);
  };

  useEffect(() => {
    if (autoAttempted) return;
    if (readPanelKey()) return;
    if (invalidKey) return;
    autoAttempted = true;
    void createConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectExisting = async () => {
    const key = existingKey.trim();
    if (key.length < 16) {
      setMessage("Anahtar en az 16 karakter olmalı.");
      return;
    }
    setBusy(true);
    setMessage("");
    const result = await panelListOrders(key);
    if (result.ok) {
      writePanelKey(key);
      setExistingKey("");
      onConnected(key);
    } else {
      setMessage(result.message || "Anahtar doğrulanamadı.");
    }
    setBusy(false);
  };

  const copyKey = async () => {
    try {
      await navigator.clipboard.writeText(createdKey);
      setMessage("Anahtar kopyalandı.");
    } catch {
      setMessage("Anahtar kopyalanamadı, elle not alabilirsiniz.");
    }
  };

  return (
    <div className="rounded-xl border border-primary-200 bg-primary-50 p-4 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-800">
            <i className="ri-link-m" />
          </span>
          <div className="min-w-0">
            <h3 className="font-heading text-sm font-bold text-foreground-950">Canlı sipariş bağlantısı</h3>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-foreground-700">
              iyzico üzerinden alınan gerçek siparişler güvenli bir bağlantı ile bu ekrana düşer. Anahtar tarayıcınızda
              saklanır, müşteri bilgileri dışarıya açılmaz.
            </p>
            {invalidKey && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-secondary-800">
                <i className="ri-error-warning-line" />
                Kayıtlı anahtar geçersiz, lütfen yeniden bağlanın.
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={createConnection}
            disabled={busy}
            className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-xs font-semibold text-background-50 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {busy ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-shield-keyhole-line" />}
            Bağlantıyı kur
          </button>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "existing" ? "idle" : "existing");
              setMessage("");
            }}
            className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 bg-background-50 px-3 text-xs font-semibold text-foreground-800 hover:bg-background-100"
          >
            <i className="ri-key-2-line" />
            Anahtarım var
          </button>
        </div>
      </div>

      {localKey && (
        <div className="mt-3 rounded-lg border border-background-200 bg-background-50 p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] font-semibold text-foreground-700">
              Bu tarayıcıda kayıtlı panel anahtarı var.
            </p>
            <button
              type="button"
              onClick={() => setShowLocalKey((value) => !value)}
              className="flex h-8 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-background-300 px-2.5 text-[11px] font-semibold text-foreground-700 hover:bg-background-100"
            >
              <i className={showLocalKey ? "ri-eye-off-line" : "ri-eye-line"} />
              {showLocalKey ? "Gizle" : "Anahtarı göster"}
            </button>
          </div>
          {showLocalKey && (
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <code className="min-w-0 flex-1 break-all rounded bg-background-100 px-2 py-1.5 font-mono text-[11px] text-foreground-900">
                {localKey}
              </code>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(localKey);
                    setMessage("Anahtar kopyalandı.");
                  } catch {
                    setMessage("Anahtar kopyalanamadı, elle not alabilirsiniz.");
                  }
                }}
                className="flex h-8 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-primary-800 px-2.5 text-[11px] font-semibold text-background-50 hover:bg-primary-700"
              >
                <i className="ri-file-copy-line" />
                Kopyala
              </button>
            </div>
          )}
          <p className="mt-1.5 text-[10px] leading-relaxed text-foreground-600">
            Başka bir tarayıcıda footer veya sipariş kaydı yapacaksanız bu anahtarı oraya bir kez yapıştırmanız yeterli.
          </p>
        </div>
      )}

      {mode === "existing" && (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={existingKey}
            onChange={(event) => setExistingKey(event.target.value)}
            placeholder="Panel anahtarını yapıştırın"
            className="h-9 min-w-0 flex-1 rounded-lg border border-background-300 bg-background-50 px-3 font-mono text-xs text-foreground-900 outline-none focus:border-primary-500"
          />
          <button
            type="button"
            onClick={connectExisting}
            disabled={busy}
            className="flex h-9 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-primary-700 px-3 text-xs font-semibold text-primary-800 hover:bg-primary-100 disabled:opacity-70"
          >
            Bağlan
          </button>
        </div>
      )}

      {createdKey && (
        <div className="mt-3 rounded-lg border border-accent-300 bg-accent-50 p-3">
          <p className="text-[11px] font-semibold text-accent-900">Panel anahtarınız oluşturuldu</p>
          <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-center">
            <code className="min-w-0 flex-1 break-all rounded bg-background-50 px-2 py-1.5 font-mono text-[11px] text-foreground-900">
              {createdKey}
            </code>
            <button
              type="button"
              onClick={copyKey}
              className="flex h-8 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-accent-700 px-2.5 text-[11px] font-semibold text-background-50 hover:bg-accent-600"
            >
              <i className="ri-file-copy-line" />
              Kopyala
            </button>
          </div>
          <p className="mt-1.5 text-[10px] leading-relaxed text-foreground-600">
            Başka bir tarayıcıdan panele girdiğinizde bu anahtarı bir kez girmeniz yeterli. Not almanızı öneririz.
          </p>
        </div>
      )}

      {message && (
        <p className="mt-2 flex items-center gap-1 text-[11px] text-foreground-700">
          <i className="ri-information-line" />
          {message}
        </p>
      )}
    </div>
  );
}