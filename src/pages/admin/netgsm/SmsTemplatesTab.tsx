import { useState } from "react";
import Modal from "@/components/base/Modal";
import { Field, Panel, Pill, inputClass, textareaClass, Banner } from "@/components/base/AdminUI";
import { smsLengthInfo } from "@/lib/integrations";
import type { SmsTemplate } from "@/types/integrations";

interface SmsTemplatesTabProps {
  templates: SmsTemplate[];
  onTemplates: (templates: SmsTemplate[]) => void;
}

const emptyDraft = { id: "", name: "", category: "Operasyon", body: "" };

export default function SmsTemplatesTab({ templates, onTemplates }: SmsTemplatesTabProps) {
  const [draft, setDraft] = useState<typeof emptyDraft | null>(null);
  const [error, setError] = useState("");

  const save = () => {
    if (!draft) return;
    if (draft.name.trim().length < 2 || draft.body.trim().length < 5) {
      setError("Şablon adı ve mesaj metni gerekli.");
      return;
    }
    if (draft.id) {
      onTemplates(templates.map((template) => (template.id === draft.id ? { ...template, ...draft } : template)));
    } else {
      onTemplates([{ ...draft, id: `t${Date.now()}` }, ...templates]);
    }
    setDraft(null);
    setError("");
  };

  return (
    <Panel
      title="SMS Şablonları"
      subtitle="Sık kullanılan mesajları hazır tutun"
      icon="ri-file-text-line"
      padded={false}
      action={
        <button
          type="button"
          onClick={() => {
            setDraft({ ...emptyDraft });
            setError("");
          }}
          className="flex h-9 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-xs font-semibold text-background-50 hover:bg-primary-700"
        >
          <i className="ri-add-line" />
          Yeni Şablon
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 md:p-5">
        {templates.map((template) => {
          const info = smsLengthInfo(template.body);
          return (
            <div key={template.id} className="rounded-lg border border-background-200 p-3.5">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground-950">{template.name}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Pill tone={template.category === "Pazarlama" ? "warning" : "info"}>{template.category}</Pill>
                    <span className="text-[10px] text-foreground-500">
                      {info.chars} karakter · {info.parts} SMS
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDraft({ ...template });
                    setError("");
                  }}
                  aria-label="Şablonu düzenle"
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-100 hover:text-foreground-900"
                >
                  <i className="ri-edit-line text-sm" />
                </button>
                <button
                  type="button"
                  onClick={() => onTemplates(templates.filter((item) => item.id !== template.id))}
                  aria-label="Şablonu sil"
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-100 hover:text-foreground-900"
                >
                  <i className="ri-delete-bin-6-line text-sm" />
                </button>
              </div>
              <p className="mt-2 rounded-md bg-background-100 p-2.5 text-[11px] leading-relaxed text-foreground-700">
                {template.body}
              </p>
            </div>
          );
        })}
      </div>

      <Modal
        open={draft !== null}
        onClose={() => setDraft(null)}
        title={draft?.id ? "Şablonu Düzenle" : "Yeni Şablon"}
        icon="ri-file-text-line"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="h-9 cursor-pointer rounded-lg border border-background-300 px-3 text-sm text-foreground-700 hover:bg-background-100"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={save}
              className="h-9 cursor-pointer rounded-lg bg-primary-800 px-4 text-sm font-semibold text-background-50 hover:bg-primary-700"
            >
              Kaydet
            </button>
          </div>
        }
      >
        {draft && (
          <div className="space-y-3">
            {error && <Banner tone="danger">{error}</Banner>}
            <Field label="Şablon adı">
              <input
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Kategori">
              <select
                value={draft.category}
                onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                className={inputClass}
              >
                <option value="Operasyon">Operasyon</option>
                <option value="Pazarlama">Pazarlama</option>
                <option value="Bilgilendirme">Bilgilendirme</option>
              </select>
            </Field>
            <Field label="Mesaj metni" hint="Değişkenler: {ad} {siparis} {takip} {kupon}">
              <textarea
                rows={4}
                value={draft.body}
                onChange={(event) => setDraft({ ...draft, body: event.target.value })}
                className={textareaClass}
              />
            </Field>
          </div>
        )}
      </Modal>
    </Panel>
  );
}