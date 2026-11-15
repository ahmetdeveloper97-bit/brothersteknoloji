import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { KEYS, loadAbandonedCarts, loadWhatsAppSettings } from "@/lib/integrations";
import { writeJson } from "@/lib/persistent";
import { formatPrice } from "@/lib/format";
import { buildCartMessage, formatTrPhone, isValidTrPhone, waLink } from "@/lib/whatsapp";
import type { AbandonedCart } from "@/types/integrations";

export default function CartReminderCard() {
  const { detailed, total } = useCart();
  const settings = useMemo(() => loadWhatsAppSettings(), []);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<AbandonedCart | null>(null);

  if (!settings.cartReminderEnabled || detailed.length === 0) return null;

  const submit = () => {
    if (name.trim().length < 2) {
      setError("Lütfen adınızı yazın.");
      return;
    }
    if (!isValidTrPhone(phone)) {
      setError("Geçerli bir cep telefonu numarası girin (05xx xxx xx xx).");
      return;
    }
    if (!consent) {
      setError("WhatsApp hatırlatması için onay vermeniz gerekiyor.");
      return;
    }

    const cart: AbandonedCart = {
      id: `AC-${Date.now().toString().slice(-5)}`,
      customer: name.trim(),
      phone: formatTrPhone(phone),
      email: "",
      items: detailed.map(({ product, quantity }) => ({
        name: product.name,
        quantity,
        price: product.price,
      })),
      total,
      abandonedAt: new Date().toLocaleString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "pending",
      reminders: 0,
      source: "Web · Sepet çekmecesi",
    };

    writeJson(KEYS.carts, [cart, ...loadAbandonedCarts()]);
    setSaved(cart);
    setError("");
  };

  if (saved) {
    return (
      <div className="rounded-lg border border-accent-300 bg-accent-50 px-3 py-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-accent-900">
          <i className="ri-checkbox-circle-line text-sm" />
          Sepetiniz kaydedildi
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-accent-800">
          {settings.reminderDelayHours} saat içinde sepetinizi tamamlamazsanız WhatsApp&apos;tan hatırlatacağız.
        </p>
        <a
          href={waLink(settings.businessNumber, buildCartMessage(saved, settings))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-accent-600 text-[11px] font-semibold text-background-50 hover:bg-accent-700"
        >
          <i className="ri-whatsapp-line text-sm" />
          Hatırlatmayı Şimdi Al
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-accent-200 bg-accent-50/70 px-3 py-2.5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer items-center gap-2 text-left"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-600 text-background-50">
          <i className="ri-whatsapp-line text-sm" />
        </span>
        <span className="min-w-0 flex-1 text-[11px] font-medium leading-snug text-accent-900">
          Sepeti WhatsApp&apos;tan hatırlatalım, %{settings.couponPercent} indirim kazanın
        </span>
        <i className={`${open ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} text-accent-700`} />
      </button>

      {open && (
        <div className="mt-2.5 space-y-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Adınız"
            className="box-border h-8 w-full rounded-md border border-accent-300 bg-background-50 px-2.5 text-xs text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-accent-500"
          />
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            inputMode="tel"
            placeholder="05xx xxx xx xx"
            className="box-border h-8 w-full rounded-md border border-accent-300 bg-background-50 px-2.5 text-xs text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-accent-500"
          />
          <label className="flex cursor-pointer items-start gap-1.5 text-[10px] leading-relaxed text-accent-800">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-0.5 h-3 w-3 cursor-pointer"
            />
            WhatsApp üzerinden hatırlatma mesajı almayı kabul ediyorum.
          </label>
          {error && <p className="text-[10px] font-medium text-foreground-900">{error}</p>}
          <button
            type="button"
            onClick={submit}
            className="h-8 w-full cursor-pointer rounded-md bg-accent-600 text-[11px] font-semibold text-background-50 hover:bg-accent-700"
          >
            Hatırlatma Planla
          </button>
          <p className="text-center text-[10px] text-accent-800">Toplam {formatPrice(total)}</p>
        </div>
      )}
    </div>
  );
}