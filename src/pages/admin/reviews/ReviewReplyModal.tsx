import { useState } from "react";
import Modal from "@/components/base/Modal";
import { Field, Pill, textareaClass } from "@/components/base/AdminUI";
import { findStaffByEmail, readAdminSessionEmail, staffInitials } from "@/lib/adminStaffStore";
import type { AdminReview } from "@/types/admin";

const quickReplies = [
  "Değerli yorumunuz için teşekkür ederiz, iyi günlerde kullanın.",
  "Geri bildiriminiz bizim için çok önemli, yaşadığınız sorun için özür dileriz.",
  "Ürünü beğenmenize çok sevindik. Bizi tekrar tercih ettiğiniz için teşekkürler!",
];

interface ReviewReplyModalProps {
  open: boolean;
  review: AdminReview | null;
  onClose: () => void;
  onSave: (reviewId: string, reply: string) => void;
}

export default function ReviewReplyModal({ open, review, onClose, onSave }: ReviewReplyModalProps) {
  const [reply, setReply] = useState(review?.reply ?? "");
  const [error, setError] = useState("");
  const author = findStaffByEmail(readAdminSessionEmail());

  const save = () => {
    if (!review) return;
    if (reply.trim().length < 10) {
      setError("Yanıt en az 10 karakter olmalıdır.");
      return;
    }
    onSave(review.id, reply.trim());
  };

  return (
    <Modal
      open={open && Boolean(review)}
      title="Yoruma yanıt ver"
      subtitle={review ? `${review.customer} · ${review.product}` : undefined}
      icon="ri-reply-line"
      onClose={onClose}
      maxWidth="max-w-lg"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium text-foreground-700 hover:bg-background-100"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={save}
            className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700"
          >
            <i className="ri-send-plane-line" />
            Yanıtı Yayınla
          </button>
        </div>
      }
    >
      {review && (
        <div className="space-y-3.5">
          {error && (
            <p className="flex items-center gap-2 rounded-lg border border-foreground-300 bg-foreground-100 px-3 py-2 text-xs text-foreground-900">
              <i className="ri-error-warning-line" />
              {error}
            </p>
          )}

          <div className="flex items-center gap-2 rounded-lg border border-background-200 bg-background-100 px-2.5 py-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-[10px] font-bold text-primary-900">
              {author?.avatarUrl ? (
                <img
                  src={author.avatarUrl}
                  alt={`${author.name} profil fotoğrafı`}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                staffInitials(author?.name ?? "Mağaza")
              )}
            </span>
            <p className="min-w-0 text-[11px] leading-tight text-foreground-600">
              <strong className="font-semibold text-foreground-950">{author?.name ?? "Mağaza"}</strong> adına
              yayınlanacak
            </p>
          </div>

          <div className="rounded-lg border border-background-200 bg-background-100 p-3">
            <div className="flex items-center gap-1.5">
              <Pill tone="neutral">{review.rating} / 5</Pill>
              <span className="text-[11px] text-foreground-500">{review.date}</span>
            </div>
            <p className="mt-1.5 text-sm font-semibold text-foreground-950">{review.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-foreground-600">{review.body}</p>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold text-foreground-700">Hazır yanıtlar</p>
            <div className="flex flex-wrap gap-1.5">
              {quickReplies.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setReply(item);
                    setError("");
                  }}
                  className="cursor-pointer rounded-full border border-background-300 bg-background-50 px-2.5 py-1 text-[11px] text-foreground-600 hover:bg-background-100"
                >
                  Şablon {index + 1}
                </button>
              ))}
            </div>
          </div>

          <Field label="Yanıtınız" hint="Yanıt, yorumun altında mağazadan yapılmış olarak görünür.">
            <textarea
              value={reply}
              onChange={(event) => {
                setReply(event.target.value);
                setError("");
              }}
              rows={4}
              maxLength={400}
              className={textareaClass}
              placeholder="Müşteriye görünecek yanıtı yazın..."
            />
          </Field>
          <p className="text-right text-[11px] text-foreground-500">{reply.length} / 400</p>
        </div>
      )}
    </Modal>
  );
}