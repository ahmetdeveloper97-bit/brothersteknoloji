import { useEffect, useState } from "react";
import Modal from "@/components/base/Modal";
import { Banner } from "@/components/base/AdminUI";
import { generatePassword } from "@/lib/password";
import type { AdminStaff } from "@/types/adminRoles";

interface PasswordResetModalProps {
  open: boolean;
  member: AdminStaff | null;
  onClose: () => void;
  onReset: (member: AdminStaff, password: string) => void;
}

export default function PasswordResetModal({ open, member, onClose, onReset }: PasswordResetModalProps) {
  const [stage, setStage] = useState<"confirm" | "result">("confirm");
  const [tempPassword, setTempPassword] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setStage("confirm");
      setTempPassword("");
      setCopied(false);
    }
  }, [open, member]);

  if (!member) return null;

  const confirmReset = () => {
    const next = generatePassword();
    setTempPassword(next);
    onReset(member, next);
    setStage("result");
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(tempPassword);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon="ri-lock-password-line"
      title="Şifre Sıfırla"
      subtitle={`${member.name} için yeni bir erişim şifresi oluşturun`}
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          {stage === "confirm" ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="w-full cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 py-2 text-sm font-semibold text-foreground-800 hover:bg-background-100 sm:w-auto"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={confirmReset}
                className="flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-700 px-5 py-2 text-sm font-semibold text-background-50 hover:bg-primary-800 sm:w-auto"
              >
                <i className="ri-refresh-line" />
                Sıfırla ve Şifre Üret
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={copyPassword}
                className="flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-background-300 px-4 py-2 text-sm font-semibold text-foreground-800 hover:bg-background-100 sm:w-auto"
              >
                <i className={copied ? "ri-check-line" : "ri-file-copy-line"} />
                {copied ? "Kopyalandı" : "Şifreyi Kopyala"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full cursor-pointer whitespace-nowrap rounded-lg bg-primary-700 px-5 py-2 text-sm font-semibold text-background-50 hover:bg-primary-800 sm:w-auto"
              >
                Tamam
              </button>
            </>
          )}
        </div>
      }
    >
      {stage === "confirm" ? (
        <div className="space-y-3">
          <div className="flex items-start gap-2.5 rounded-lg border border-background-200 bg-background-100 px-3 py-2.5">
            <i className="ri-user-line mt-0.5 text-sm text-primary-700" />
            <div className="min-w-0 text-xs leading-relaxed text-foreground-700">
              <p className="truncate font-semibold text-foreground-950">{member.email}</p>
              <p className="mt-0.5">Mevcut şifre geçersiz olacak. Kişi yeni şifresiyle giriş yapmak zorunda kalacak.</p>
            </div>
          </div>
          <Banner tone="warning">
            Geçici şifre yalnızca bir kez gösterilir. Sıfırlama işlemi işlem geçmişine kaydedilir.
          </Banner>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border border-accent-300 bg-accent-50 px-4 py-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-accent-900">Geçici şifre</p>
            <p className="mt-1.5 select-all font-mono text-2xl font-bold tracking-[0.18em] text-foreground-950">
              {tempPassword}
            </p>
            <p className="mt-1.5 text-[11px] text-foreground-600">Bu ekranı kapattıktan sonra tekrar görüntülenemez.</p>
          </div>
          <div className="rounded-lg bg-background-100 px-3 py-2.5 text-xs leading-relaxed text-foreground-700">
            <p className="font-semibold text-foreground-900">İletim adımları</p>
            <p className="mt-1">
              Şifreyi kullanıcıya güvenli bir kanaldan iletin. Kullanıcı panele girdikten sonra sağ üstteki profil menüsünden
              <span className="font-semibold text-foreground-900"> Şifre Değiştir</span> ile kendi şifresini belirleyebilir.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}