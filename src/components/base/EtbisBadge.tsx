import { QRCodeCanvas } from "qrcode.react";
import type { EtbisSettings } from "@/types/admin";

interface EtbisBadgeProps {
  settings: EtbisSettings;
  size?: number;
}

const FALLBACK_URL = "https://etbis.ticaret.gov.tr/tr";

/**
 * ETBIS resmi rozet görünümü: solda QR (ortasında ETBIS işareti),
 * sağda kırmızı "ETBİS", lacivert "ETBİS'e Kayıtlıdır"
 * ve yeşil tikli "Ticaret Bakanlığı" satırı.
 */
export default function EtbisBadge({ settings, size = 84 }: EtbisBadgeProps) {
  if (!settings.enabled) return null;

  const target = settings.profileUrl?.trim() || FALLBACK_URL;
  const title = settings.registrationNumber
    ? `ETBIS kayıt profili — Kayıt No: ${settings.registrationNumber}`
    : "ETBIS kayıt profili — yeni sekmede açılır";

  return (
    <a
      href={target}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      aria-label={`ETBIS'e kayıtlıdır — ${settings.companyName || "kayıt profilini"} yeni sekmede aç`}
      className="group inline-flex cursor-pointer items-center gap-2.5 rounded-2xl bg-white px-2.5 py-2 shadow-[0_1px_4px_rgba(15,23,42,0.14)] ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(15,23,42,0.18)]"
    >
      {settings.showQr && (
        <span className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
          <QRCodeCanvas value={target} size={size} bgColor="#ffffff" fgColor="#141414" level="H" />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[3px] bg-white">
              <span className="flex h-[15px] w-[15px] flex-col items-stretch justify-center gap-[2px] rounded-[2px] bg-[#e30613] px-[2px]">
                <span className="h-[2px] w-full rounded-full bg-white/95" />
                <span className="h-[2px] w-full rounded-full bg-white/95" />
                <span className="h-[2px] w-[70%] rounded-full bg-white/95" />
              </span>
            </span>
          </span>
        </span>
      )}

      <span className="flex min-w-0 flex-col justify-center pr-0.5 text-left leading-none">
        <span className="text-[15px] font-extrabold tracking-[0.03em] text-[#e30613]">ETBİS</span>
        <span className="mt-[3px] block max-w-[76px] text-[11px] font-semibold leading-[1.12] text-[#2b3f66]">
          ETBİS'e Kayıtlıdır
        </span>
        <span className="mt-[5px] flex items-center gap-1 whitespace-nowrap text-[10.5px] font-semibold leading-none text-[#0d9b4a]">
          <i className="ri-checkbox-circle-fill text-[13px] leading-none" aria-hidden="true" />
          Ticaret Bakanlığı
        </span>
      </span>
    </a>
  );
}