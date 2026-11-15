import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  clearChatHistory,
  fetchAiPublicConfig,
  readChatHistory,
  sendAiChatMessage,
  writeChatHistory,
} from "@/lib/aiSupport";
import { emitSupportPanel, subscribeSupportPanel } from "@/lib/supportWidgets";
import type { AiChatMessage, AiPublicConfig } from "@/types/aiSupport";

const uid = (): string => `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export default function AiSupportWidget() {
  const location = useLocation();
  const [config, setConfig] = useState<AiPublicConfig | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>(() => readChatHistory());
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [otherOpen, setOtherOpen] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let active = true;
    void fetchAiPublicConfig().then((next) => {
      if (active) setConfig(next);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    writeChatHistory(messages);
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, sending, open]);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  useEffect(() => {
    emitSupportPanel("ai", open);
  }, [open]);

  useEffect(
    () =>
      subscribeSupportPanel(({ source, open: isOpen }) => {
        if (source === "ai") return;
        setOtherOpen(isOpen);
        if (isOpen) setOpen(false);
      }),
    [],
  );

  if (!config || !config.enabled) return null;

  const submit = async (raw: string) => {
    const content = raw.trim().slice(0, 1000);
    if (!content || sending) return;

    const userMessage: AiChatMessage = { id: uid(), role: "user", content, at: Date.now() };
    const next = [...messages, userMessage];
    setMessages(next);
    setDraft("");
    setError("");
    setSending(true);

    const result = await sendAiChatMessage(next, location.pathname);
    setSending(false);

    if (result.ok && result.reply) {
      setMessages((current) => [
        ...current,
        { id: uid(), role: "assistant", content: String(result.reply), at: Date.now() },
      ]);
      return;
    }
    setError(result.message ?? "Yanıt alınamadı. Lütfen tekrar deneyin.");
  };

  const resetChat = () => {
    setMessages([]);
    setDraft("");
    setError("");
    clearChatHistory();
  };

  return (
    <>
      <div
        className={`fixed bottom-[152px] right-4 z-[62] w-[calc(100vw-2rem)] max-w-[380px] origin-bottom-right transition-all duration-200 md:bottom-[156px] md:right-6 ${
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="flex max-h-[72vh] flex-col overflow-hidden rounded-2xl border border-background-200 bg-background-50 shadow-2xl">
          <div className="flex items-center gap-2.5 bg-primary-800 px-4 py-3 text-background-50">
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background-50/20">
              <i className="ri-robot-2-line text-lg" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-primary-800 bg-accent-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-sm font-bold">Yapay Zeka Destek</p>
              <p className="mt-0.5 truncate text-[11px] text-background-50/75">
                Anında yanıt • 7/24 çevrimiçi
              </p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={resetChat}
                aria-label="Sohbeti temizle"
                title="Sohbeti temizle"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-background-50/75 hover:bg-background-50/15 hover:text-background-50"
              >
                <i className="ri-delete-bin-6-line text-sm" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Sohbeti kapat"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-background-50/75 hover:bg-background-50/15 hover:text-background-50"
            >
              <i className="ri-close-line" />
            </button>
          </div>

          <div
            ref={listRef}
            className="min-h-[220px] flex-1 space-y-2.5 overflow-y-auto bg-background-100 px-3.5 py-3.5"
          >
            <div className="max-w-[92%] rounded-xl rounded-tl-sm border border-background-200 bg-background-50 px-3 py-2.5 text-xs leading-relaxed text-foreground-800">
              {config.welcomeMessage}
            </div>

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-wrap rounded-xl px-3 py-2.5 text-xs leading-relaxed ${
                    message.role === "user"
                      ? "rounded-tr-sm bg-primary-800 text-background-50"
                      : "rounded-tl-sm border border-background-200 bg-background-50 text-foreground-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-xl rounded-tl-sm border border-background-200 bg-background-50 px-3 py-2.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground-400" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground-400 [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground-400 [animation-delay:240ms]" />
                  <span className="ml-1 text-[11px] text-foreground-500">Yazıyor...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-secondary-300 bg-secondary-50 px-2.5 py-2 text-[11px] leading-relaxed text-secondary-950">
                <i className="ri-error-warning-line mt-0.5" />
                <span className="min-w-0 flex-1">{error}</span>
                <button
                  type="button"
                  onClick={() => setError("")}
                  aria-label="Uyarıyı kapat"
                  className="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center"
                >
                  <i className="ri-close-line" />
                </button>
              </div>
            )}

            {messages.length === 0 && !sending && config.quickQuestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {config.quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => void submit(question)}
                    className="cursor-pointer whitespace-nowrap rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-[11px] font-medium text-primary-900 hover:bg-primary-100"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-background-200 bg-background-50 px-3 py-3">
            <div className="flex items-end gap-2">
              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value.slice(0, 1000))}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void submit(draft);
                  }
                }}
                placeholder="Sorunuzu yazın..."
                aria-label="Yapay zeka asistanına mesaj"
                className="box-border h-10 min-w-0 flex-1 rounded-lg border border-background-300 bg-background-100 px-3 text-xs text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500 focus:bg-background-50"
              />
              <button
                type="button"
                onClick={() => void submit(draft)}
                disabled={sending || draft.trim().length === 0}
                aria-label="Mesajı gönder"
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-primary-800 text-background-50 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <i className={sending ? "ri-loader-4-line animate-spin" : "ri-send-plane-2-line"} />
              </button>
            </div>
            <p className="mt-2 flex items-center gap-1 text-[10px] text-foreground-400">
              <i className="ri-sparkling-line" />
              Yanıtlar yapay zeka tarafından oluşturulur, bilgilendirme amaçlıdır.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Yapay zeka canlı destek"
        className={`group fixed bottom-[88px] right-4 z-[61] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary-800 text-background-50 shadow-lg shadow-primary-950/25 transition-all hover:scale-105 hover:bg-primary-700 md:bottom-[92px] md:right-6 ${
          otherOpen && !open ? "pointer-events-none scale-90 opacity-0" : "opacity-100"
        }`}
      >
        <i className={`${open ? "ri-close-line" : "ri-robot-2-line"} text-2xl`} />
        {!open && (
          <span className="absolute -right-1 -top-1 flex h-5 items-center justify-center rounded-full border-2 border-background-50 bg-accent-500 px-1 text-[9px] font-bold text-background-50">
            AI
          </span>
        )}
      </button>
    </>
  );
}