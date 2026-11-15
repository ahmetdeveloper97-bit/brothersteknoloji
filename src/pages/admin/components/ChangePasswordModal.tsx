import { useEffect, useState } from "react";
import Modal from "@/components/base/Modal";
import { Banner, Field, inputClass } from "@/components/base/AdminUI";
import { findStaffByEmail, readAdminSessionEmail, changeAdminPassword } from "@/lib/adminStaffStore";
import { logActivity } from "@/lib/activity";
import { passwordStrength } from "@/lib/password";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function ChangePasswordModal({ open, onClose, onSaved }: ChangePasswordModalProps) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setCurrent("");
      setNext("");
      setRepeat("");
      setShow(false);
      setError("");
      setDone(false);
      setBusy(false);
    }
  }, [open]);

  const member = findStaffByEmail(readAdminSessionEmail());
  const strength = passwordStrength(next);

  const submit = async () => {
    if (!member) {
      setError("Oturum bilgisi bulunamadı, lütfen tekrar giriş yapın.");
      return;
    }
    if (!current.trim()) {
      setError("Mevcut şifrenizi girin.");
      return;
    }
    if (next.length < 6) {
      setError("Yeni şifre en az 6 karakter olmalı.");
      return;
    }
    if (next !== repeat) {
      setError("Yeni şifreler birbiriyle uyuşmuyor.");
      return;
    }

    setBusy(true);
    const result = await changeAdminPassword(current, next);
    setBusy(false);

    if (!result.ok) {
      setError(result.message ?? "Şifre güncellenemedi. Lütfen tekrar deneyin.");
      return;
    }

    logActivity({
      category: "security",
      action: "Kendi şifresini değiştirdi",
      target: member.name,
      detail: "Kişisel hesap şifresi güncellendi",
    });
    setError("");
    setDone(true);
    onSaved?.();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon="ri-lock-password-line"
      title="Şifre Değiştir"
      subtitle={member ? `${member.email} hesabı için yeni şifre belirleyin` : "Hesap şifrenizi güncelleyin"}
      footer={
        done ? (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full cursor-pointer whitespace-nowrap rounded-lg bg-primary-700 px-5 py-2 text-sm font-semibold text-background-50 hover:bg-primary-800 sm:w-auto"
            >
              Tamam
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 py-2 text-sm font-semibold text-foreground-800 hover:bg-background-100 sm:w-auto"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={() => void submit()}
              disabled={busy}
              className="flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-700 px-5 py-2 text-sm font-semibold text-background-50 hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              <i className={busy ? "ri-loader-4-line animate-spin" : "ri-save-3-line"} />
              Şifreyi Güncelle
            </button>
          </div>
        )
      }
    >
      {done ? (
        <Banner tone="success">Şifreniz güncellendi. Bir sonraki girişte yeni şifrenizi kullanabilirsiniz.</Banner>
      ) : (
        <div className="space-y-3">
          {error && <Banner tone="warning">{error}</Banner>}

          <Field label="Mevcut şifre">
            <input
              type={show ? "text" : "password"}
              className={inputClass}
              value={current}
              onChange={(event) => setCurrent(event.target.value)}
              placeholder="••••••"
              autoComplete="current-password"
            />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Yeni şifre" hint="En az 6 karakter">
              <input
                type={show ? "text" : "password"}
                className={inputClass}
                value={next}
                onChange={(event) => setNext(event.target.value)}
                placeholder="••••••"
                autoComplete="new-password"
              />
            </Field>
            <Field label="Yeni şifre (tekrar)">
              <input
                type={show ? "text" : "password"}
                className={inputClass}
                value={repeat}
                onChange={(event) => setRepeat(event.target.value)}
                placeholder="••••••"
                autoComplete="new-password"
              />
            </Field>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background-200">
                <div
                  className={`h-full rounded-full transition-all ${
                    strength.score >= 4 ? "bg-accent-600" : strength.score >= 2 ? "bg-primary-600" : "bg-secondary-500"
                  }`}
                  style={{ width: `${(strength.score / 4) * 100}%` }}
                />
              </div>
              <span className="w-16 shrink-0 text-right text-[11px] font-medium text-foreground-600">{strength.label}</span>
            </div>
            <button
              type="button"
              onClick={() => setShow((value) => !value)}
              className="flex cursor-pointer items-center gap-1 whitespace-nowrap text-[11px] font-medium text-primary-700 hover:text-primary-900"
            >
              <i className={show ? "ri-eye-off-line" : "ri-eye-line"} />
              {show ? "Gizle" : "Göster"}
            </button>
          </div>

          <p className="text-[11px] leading-relaxed text-foreground-500">
            Şifre değişikliği işlem geçmişine güvenlik kaydı olarak eklenir. Şifrenizi unutursanız genel yönetici
            Yöneticiler ekranından sıfırlayabilir.
          </p>
        </div>
      )}
    </Modal>
  );
}