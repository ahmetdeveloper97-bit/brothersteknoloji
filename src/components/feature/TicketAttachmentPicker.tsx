import { useRef } from "react";
import {
  ACCEPTED_ATTACHMENTS,
  MAX_ATTACHMENTS,
  MAX_ATTACHMENT_BYTES,
  formatFileSize,
  isImageAttachment,
  readFileAsBase64,
} from "@/lib/supportTickets";
import type { PendingAttachment } from "@/types/supportTicket";

interface TicketAttachmentPickerProps {
  value: PendingAttachment[];
  onChange: (next: PendingAttachment[]) => void;
  onError?: (message: string) => void;
  hint?: string;
}

export default function TicketAttachmentPicker({
  value,
  onChange,
  onError,
  hint,
}: TicketAttachmentPickerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    if (value.length + list.length > MAX_ATTACHMENTS) {
      onError?.(`En fazla ${MAX_ATTACHMENTS} dosya ekleyebilirsiniz.`);
      return;
    }

    const accepted: PendingAttachment[] = [];
    for (const file of list) {
      if (file.size > MAX_ATTACHMENT_BYTES) {
        onError?.(`"${file.name}" 3 MB sınırını aşıyor. Lütfen daha küçük bir dosya seçin.`);
        continue;
      }
      if (file.size === 0) {
        onError?.(`"${file.name}" boş bir dosya.`);
        continue;
      }
      try {
        accepted.push(await readFileAsBase64(file));
      } catch {
        onError?.(`"${file.name}" okunamadı. Lütfen tekrar deneyin.`);
      }
    }

    if (accepted.length > 0) onChange([...value, ...accepted].slice(0, MAX_ATTACHMENTS));
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_ATTACHMENTS}
        multiple
        className="hidden"
        onChange={(event) => void handleFiles(event.target.files)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={value.length >= MAX_ATTACHMENTS}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-background-300 bg-background-100 px-3 py-3 text-xs font-semibold text-foreground-700 transition-colors hover:border-primary-400 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <i className="ri-attachment-2 text-base" />
        Dosya veya ekran görüntüsü ekle
        <span className="rounded-full bg-background-50 px-1.5 py-0.5 text-[10px] font-bold text-foreground-500">
          {value.length}/{MAX_ATTACHMENTS}
        </span>
      </button>
      <p className="mt-1.5 text-[11px] leading-relaxed text-foreground-500">
        {hint ?? "PNG, JPG, WEBP, GIF veya PDF · Her dosya en fazla 3 MB · En fazla 3 dosya"}
      </p>

      {value.length > 0 && (
        <ul className="mt-2.5 space-y-2">
          {value.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-2.5 rounded-lg border border-background-200 bg-background-50 p-2"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background-100 text-foreground-500">
                <i className={`${isImageAttachment(file.type) ? "ri-image-line" : "ri-file-pdf-line"} text-base`} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-foreground-900">{file.name}</span>
                <span className="block text-[10px] text-foreground-500">{formatFileSize(file.size)}</span>
              </span>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
                aria-label={`${file.name} dosyasını kaldır`}
                className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground-500 hover:bg-background-100 hover:text-foreground-900"
              >
                <i className="ri-close-line" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}