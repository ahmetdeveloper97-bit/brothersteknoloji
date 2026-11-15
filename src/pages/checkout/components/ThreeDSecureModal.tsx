import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";

interface ThreeDSecureModalProps {
  open: boolean;
  amount: number;
  cardMask: string;
  merchant: string;
  onClose: () => void;
  onApprove: () => void;
}

export default function ThreeDSecureModal({ open, amount, cardMask, merchant, onClose, onApprove }: ThreeDSecureModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(90);

  useEffect(() => {
    if (!open) return;
    setCode("");
    setError("");
    setSeconds(90);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setInterval(() => {
      setSeconds((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [open]);

  if (!open) return null;

  const approve = () => {
    if (seconds === 0) {
      setError("Doğrulama süresi doldu. Yeni şifre talep edin.");
      return;
    }
    if (code !== "1234") {
      setError("Girdiğiniz şifre hatalı. Lütfen tekrar deneyin.");
      return;
    }
    setError("");
    onApprove();
  };

  return (
    <div className="fixed inset-0 z-[96] flex items-end justify-center sm:items-center sm:p-4">
      <div onClick={onClose} className="absolute inset-0 bg-primary-950/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm overflow-hidden rounded-t-2xl bg-background-50 shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between bg-primary-900 px-4 py-3 text-background-50">
          <div className="flex items-center gap-2">
            <i className="ri-shield-keyhole-line text-lg" />
            <div>
              <p className="font-heading text-xs font-bold">3D Secure Doğrulama</p>
              <p className="text-[10px] text-background-50/70">Banka güvenlik adımı</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Doğrulamayı kapat"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full hover:bg-background-50/15"
          >
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="space-y-3 px-5 py-4">
          <p className="text-xs leading-relaxed text-foreground-600">
            <strong className="font-semibold text-foreground-900">{merchant}</strong> için{" "}
            <strong className="font-semibold text-foreground-900">{formatPrice(amount)}</strong> tutarındaki ödemeyi
            onaylamak üzere <span className="whitespace-nowrap">{cardMask}</span> kartınıza gönderilen tek kullanımlık
            şifreyi girin.
          </p>

          <input
            value={code}
            onChange={(event) => {
              setCode(event.target.value.replace(/\D/g, "").slice(0, 4));
              setError("");
            }}
            inputMode="numeric"
            placeholder="••••"
            className="box-border h-12 w-full rounded-lg border border-background-300 bg-background-100 text-center text-xl font-bold tracking-[0.5em] text-foreground-950 outline-none placeholder:tracking-[0.3em] placeholder:text-foreground-400 focus:border-primary-500 focus:bg-background-50"
          />

          {error && <p className="text-[11px] font-medium text-foreground-900">{error}</p>}

          <div className="flex items-center justify-between text-[11px] text-foreground-500">
            <span>Kalan süre: 00:{String(seconds).padStart(2, "0")}</span>
            <button
              type="button"
              onClick={() => {
                setSeconds(90);
                setError("");
              }}
              className="cursor-pointer underline decoration-dotted"
            >
              Şifreyi yeniden gönder
            </button>
          </div>

          <button
            type="button"
            onClick={approve}
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 text-sm font-semibold text-background-50 hover:bg-primary-700"
          >
            <i className="ri-check-line" />
            Doğrula ve Öde
          </button>

          <p className="rounded-md bg-accent-50 px-2.5 py-2 text-center text-[10px] leading-relaxed text-accent-900">
            Demo modu: doğrulama şifresi <strong>1234</strong>. Canlı ödemede bu adım bankanızın kendi ekranında
            gerçekleşir.
          </p>
        </div>
      </div>
    </div>
  );
}