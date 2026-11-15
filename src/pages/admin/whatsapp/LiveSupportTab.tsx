import { useState } from "react";
import { Banner, Field, Kpi, Panel, Toggle, inputClass, textareaClass } from "@/components/base/AdminUI";
import { waLink } from "@/lib/whatsapp";
import type { WhatsAppSettings } from "@/types/integrations";

interface LiveSupportTabProps {
  settings: WhatsAppSettings;
  onSettings: (patch: Partial<WhatsAppSettings>) => void;
}

interface ConversationRow {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export default function LiveSupportTab({ settings, onSettings }: LiveSupportTabProps) {
  const [newLabel, setNewLabel] = useState("");
  const [newText, setNewText] = useState("");
  const [flash, setFlash] = useState("");
  const conversations: ConversationRow[] = [];

  const addReply = () => {
    if (newLabel.trim().length < 2 || newText.trim().length < 3) {
      setFlash("Hızlı yanıt için başlık ve mesaj gerekli.");
      return;
    }
    onSettings({
      quickReplies: [
        ...settings.quickReplies,
        { id: `q${Date.now()}`, label: newLabel.trim(), text: newText.trim() },
      ],
    });
    setNewLabel("");
    setNewText("");
    setFlash("Hızlı yanıt eklendi.");
  };

  const removeReply = (id: string) => {
    onSettings({ quickReplies: settings.quickReplies.filter((reply) => reply.id !== id) });
  };

  return (
    <div className="space-y-4">
      {flash && <Banner tone="success" onClose={() => setFlash("")}>{flash}</Banner>}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi icon="ri-chat-smile-3-line" label="Bugünkü Sohbet" value={String(conversations.length)} hint="Canlı sohbet kaydı" tone="info" />
        <Kpi icon="ri-timer-line" label="Ortalama Yanıt" value="—" hint="Veri bekleniyor" tone="success" />
        <Kpi icon="ri-emotion-happy-line" label="Memnuniyet" value="—" hint="Değerlendirme yok" tone="warning" />
        <Kpi icon="ri-time-line" label="Açık Talep" value="0" hint="Bekleyen talep yok" tone="neutral" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel title="Canlı Destek Ayarları" subtitle="Mağazadaki WhatsApp balonunu yönetin" icon="ri-whatsapp-line">
          <div className="space-y-4">
            <Toggle
              checked={settings.liveSupportEnabled}
              onChange={(value) => onSettings({ liveSupportEnabled: value })}
              label="Canlı destek balonu aktif"
              description="Kapatırsanız mağazada WhatsApp butonu görünmez."
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="WhatsApp numarası" hint="Ülke kodu olmadan 05xx... girin.">
                <input
                  value={settings.businessNumber}
                  onChange={(event) => onSettings({ businessNumber: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Görünen ad">
                <input
                  value={settings.displayName}
                  onChange={(event) => onSettings({ displayName: event.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Çalışma saatleri">
              <input
                value={settings.workingHours}
                onChange={(event) => onSettings({ workingHours: event.target.value })}
                className={inputClass}
              />
            </Field>

            <Field label="Karşılama mesajı">
              <textarea
                rows={3}
                value={settings.greeting}
                onChange={(event) => onSettings({ greeting: event.target.value })}
                className={textareaClass}
              />
            </Field>

            <Field label="Çevrimdışı mesajı">
              <textarea
                rows={2}
                value={settings.awayMessage}
                onChange={(event) => onSettings({ awayMessage: event.target.value })}
                className={textareaClass}
              />
            </Field>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Hızlı Yanıtlar" subtitle="Sohbette tek tıkla kullanılan hazır mesajlar" icon="ri-flashlight-line">
            <ul className="space-y-2">
              {settings.quickReplies.map((reply) => (
                <li key={reply.id} className="flex items-start gap-2 rounded-lg border border-background-200 p-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground-900">{reply.label}</p>
                    <p className="mt-0.5 line-clamp-2-safe text-[11px] text-foreground-500">{reply.text}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeReply(reply.id)}
                    aria-label="Hızlı yanıtı sil"
                    className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-100 hover:text-foreground-900"
                  >
                    <i className="ri-delete-bin-6-line text-sm" />
                  </button>
                </li>
              ))}
              {settings.quickReplies.length === 0 && (
                <li className="rounded-lg border border-dashed border-background-300 py-6 text-center text-xs text-foreground-500">
                  Henüz hızlı yanıt yok.
                </li>
              )}
            </ul>

            <div className="mt-3 space-y-2 rounded-lg bg-background-100 p-3">
              <input
                value={newLabel}
                onChange={(event) => setNewLabel(event.target.value)}
                placeholder="Başlık (ör. Kargo süresi)"
                className={inputClass}
              />
              <input
                value={newText}
                onChange={(event) => setNewText(event.target.value)}
                placeholder="Mesaj metni"
                className={inputClass}
              />
              <button
                type="button"
                onClick={addReply}
                className="flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary-800 text-xs font-semibold text-background-50 hover:bg-primary-700"
              >
                <i className="ri-add-line" />
                Hızlı Yanıt Ekle
              </button>
            </div>
          </Panel>

          <Panel title="Son Sohbetler" subtitle="WhatsApp üzerinden yanıtlayın" icon="ri-chat-3-line" padded={false}>
            <ul className="divide-y divide-background-100">
              {conversations.map((conversation) => (
                <li key={conversation.id} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-100 text-[11px] font-bold text-accent-900">
                    {conversation.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-xs font-semibold text-foreground-900">{conversation.name}</p>
                      {conversation.unread > 0 && (
                        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-600 px-1 text-[9px] font-bold text-background-50">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-[11px] text-foreground-500">{conversation.lastMessage}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="hidden text-[10px] text-foreground-400 sm:block">{conversation.time}</span>
                    <a
                      href={waLink(conversation.phone, `Merhaba ${conversation.name.split(" ")[0]}, Brothers Teknoloji destek ekibinden yazıyoruz.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp sohbetini aç"
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-accent-100 text-accent-800 hover:bg-accent-200"
                    >
                      <i className="ri-whatsapp-line text-sm" />
                    </a>
                  </div>
                </li>
              ))}
              {conversations.length === 0 && (
                <li className="px-4 py-10 text-center">
                  <i className="ri-chat-off-line mb-2 block text-2xl text-foreground-300" />
                  <p className="text-sm font-medium text-foreground-700">Henüz sohbet kaydı yok</p>
                  <p className="mt-1 text-xs text-foreground-500">
                    Müşteriler WhatsApp üzerinden yazdığında sohbetler burada listelenir.
                  </p>
                </li>
              )}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}