import { useMemo } from "react";
import { encodeCode39 } from "@/lib/barcode";

interface BarcodeProps {
  value: string;
  /** Barkod çubuklarının yüksekliği (CSS ölçüsü) */
  height?: string;
  /** Barkodun altında okunabilir metni göster */
  showText?: boolean;
  /** Çubuk kalınlığı çarpanı — termal yazıcıda 1 yeterli */
  wideRatio?: number;
  textClassName?: string;
  className?: string;
}

export default function Barcode({
  value,
  height = "52px",
  showText = true,
  wideRatio = 3,
  textClassName = "text-[11px]",
  className = "",
}: BarcodeProps) {
  const encoded = useMemo(() => encodeCode39(value, wideRatio), [value, wideRatio]);

  if (!encoded.bars.length) {
    return (
      <div className={`barcode-surface flex items-center justify-center rounded border border-dashed border-foreground-300 px-2 py-3 text-[10px] text-foreground-500 ${className}`}>
        Barkod için geçerli bir değer yok
      </div>
    );
  }

  return (
    <div className={`barcode-surface ${className}`}>
      <div
        role="img"
        aria-label={`Barkod ${encoded.text}`}
        className="barcode-surface flex w-full items-stretch overflow-hidden"
        style={{ height }}
      >
        {encoded.bars.map((bar, index) => (
          <span
            key={`${index}-${bar.width}-${bar.dark ? "d" : "l"}`}
            className="block h-full shrink-0"
            style={{
              width: `${(bar.width / encoded.modules) * 100}%`,
              backgroundColor: bar.dark ? "currentColor" : "transparent",
            }}
          />
        ))}
      </div>
      {showText && (
        <p
          className={`mt-1 text-center font-mono font-semibold tracking-[0.2em] text-foreground-950 ${textClassName}`}
        >
          {encoded.text}
        </p>
      )}
    </div>
  );
}