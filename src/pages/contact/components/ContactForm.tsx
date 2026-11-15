import { useState } from "react";
import type { FormEvent } from "react";
import { inputClass, textareaClass } from "@/components/base/AdminUI";

const FORM_ID = "dbqf9rilo38lbcf155b0";
const SUBMIT_ADDR = "https://readdy.ai/api/form/dbqf9rilo38lbcf155b0";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const honeypot = String(data.get("website_alt") ?? "").trim();
    if (honeypot) {
      setStatus("success");
      setMessage("Mesajınız bize ulaştı. En kısa sürede dönüş yapacağız.");
      form.reset();
      setCount(0);
      return;
    }

    const payload = new URLSearchParams();
    data.forEach((value, key) => {
      if (key === "website_alt") return;
      if (typeof value === "string" && value.trim() !== "") payload.append(key, value);
    });

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch(SUBMIT_ADDR, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString(),
      });
      const responseText = await response.text();
      let parsed: { code?: string; message?: string; meta?: { message?: string; detail?: string } } | null = null;
      try {
        parsed = JSON.parse(responseText) as typeof parsed;
      } catch {
        parsed = null;
      }

      const serverMessage = parsed?.meta?.message || parsed?.message || parsed?.meta?.detail || "";
      const failed =
        !response.ok ||
        parsed?.code !== "OK" ||
        serverMessage.toLowerCase().includes("spam");

      if (failed) {
        setStatus("error");
        setMessage(
          serverMessage ||
            "Mesajınız gönderilemedi. Lütfen bilgilerinizi kontrol edip tekrar deneyin veya bizi telefonla arayın.",
        );
        return;
      }

      setStatus("success");
      setMessage("Mesajınız bize ulaştı. En kısa sürede size dönüş yapacağız.");
      form.reset();
      setCount(0);
    } catch {
      setStatus("error");
      setMessage("Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.");
    }
  };

  return (
    <form
      id={FORM_ID}
      data-readdy-form
      onSubmit={(event) => void handleSubmit(event)}
      className="rounded-xl border border-background-200 bg-background-50 p-4 md:p-6"
      noValidate={false}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-800">
          <i className="ri-mail-send-line text-lg" />
        </span>
        <div className="min-w-0">
          <h2 className="font-heading text-base font-bold text-foreground-950">Bize yazın</h2>
          <p className="mt-1 text-xs leading-relaxed text-foreground-600">
            Formu doldurun, ekibimiz en geç bir iş günü içinde e-posta ile dönüş yapsın. Dosya veya ekran görüntüsü
            paylaşmak isterseniz destek talebi oluşturmayı tercih edin.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-semibold text-foreground-700">Ad Soyad</span>
          <input name="name" required maxLength={80} placeholder="Adınız Soyadınız" className={inputClass} />
        </label>
        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-semibold text-foreground-700">E-posta</span>
          <input type="email" name="email" required maxLength={120} placeholder="ornek@eposta.com" className={inputClass} />
        </label>
        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-semibold text-foreground-700">Telefon</span>
          <input type="tel" name="phone" maxLength={30} placeholder="05xx xxx xx xx" className={inputClass} />
        </label>
        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-semibold text-foreground-700">Konu</span>
          <select name="subject" required className={inputClass} defaultValue="genel">
            <option value="siparis">Sipariş</option>
            <option value="kargo">Kargo ve teslimat</option>
            <option value="urun">Ürün bilgisi</option>
            <option value="odeme">Ödeme ve fatura</option>
            <option value="iade">İade ve değişim</option>
            <option value="genel">Genel bilgi</option>
          </select>
        </label>
      </div>

      <label className="mt-3 block min-w-0">
        <span className="mb-1.5 flex items-center justify-between gap-2 text-xs font-semibold text-foreground-700">
          Mesajınız
          <span className="font-normal text-foreground-400">{count}/500</span>
        </span>
        <textarea
          name="message"
          required
          maxLength={500}
          rows={5}
          onChange={(event) => setCount(event.target.value.length)}
          placeholder="Bize nasıl yardımcı olabileceğimizi yazın..."
          className={textareaClass}
        />
      </label>

      <div className="form-extra-field">
        <label>
          Website
          <input type="text" name="website_alt" tabIndex={-1} autoComplete="off" aria-hidden="true" readOnly />
        </label>
      </div>

      {message && (
        <div
          className={`mt-3 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-xs leading-relaxed ${
            status === "success"
              ? "border-accent-300 bg-accent-50 text-accent-900"
              : "border-secondary-300 bg-secondary-50 text-secondary-950"
          }`}
        >
          <i className={`${status === "success" ? "ri-checkbox-circle-line" : "ri-error-warning-line"} mt-0.5 text-base`} />
          <span>{message}</span>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-800 px-5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {status === "sending" ? (
            <>
              <i className="ri-loader-4-line animate-spin" />
              Gönderiliyor
            </>
          ) : (
            <>
              <i className="ri-send-plane-line" />
              Mesajı Gönder
            </>
          )}
        </button>
        <p className="text-[11px] leading-relaxed text-foreground-500">
          Gönderdiğiniz bilgiler yalnızca talebinizi yanıtlamak için kullanılır.
        </p>
      </div>
    </form>
  );
}