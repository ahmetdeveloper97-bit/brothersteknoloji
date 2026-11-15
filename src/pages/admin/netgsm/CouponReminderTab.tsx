import { useEffect, useMemo, useState } from "react";
import { Banner, Field, Kpi, Panel, Pill, Toggle, inputClass } from "@/components/base/AdminUI";
import { formatDateTr, formatNumberTr } from "@/lib/adminStore";
import { couponExpiryLabel, couponHintLabel } from "@/lib/coupons";
import { formatPrice } from "@/lib/format";
import { KEYS } from "@/lib/integrations";
import { writeJson } from "@/lib/persistent";
import { SMS_UNIT_PRICE } from "@/lib/smsNotify";
import { segmentOptions } from "@/lib/segmentSms";
import {
  autoPlanReminders,
  dueReminders,
  expiringCoupons,
  loadCouponReminderSettings,
  loadCouponReminders,
  pendingReminderFor,
  reminderRecipients,
  reminderTemplates,
  sendReminder,
  todayStr,
} from "@/lib/couponReminders";
import CouponReminderPlanModal from "@/pages/admin/netgsm/CouponReminderPlanModal";
import type { Campaign, CustomerSegment } from "@/types/admin";
import type { CouponReminder, CouponReminderSettings } from "@/types/couponReminder";
import type { NetgsmSettings, SmsMessage } from "@/types/integrations";

interface CouponReminderTabProps {
  settings: NetgsmSettings;
  logs: SmsMessage[];
  onLogs: (logs: SmsMessage[]) => void;
  onSettings: (patch: Partial<NetgsmSettings>) => void;
}

type Feedback = { tone: "success" | "danger" | "warning" | "info"; text: string };
type ReminderFilter = "all" | "scheduled" | "sent" | "cancelled";

const statusLabel: Record<CouponReminder["status"], string> = {
  scheduled: "Planlandı",
  sent: "Gönderildi",
  cancelled: "İptal edildi",
};

const statusTone: Record<CouponReminder["status"], "info" | "success" | "neutral"> = {
  scheduled: "info",
  sent: "success",
  cancelled: "neutral",
};

export default function CouponReminderTab({ settings, logs, onLogs, onSettings }: CouponReminderTabProps) {
  const [config, setConfig] = useState<CouponReminderSettings>(loadCouponReminderSettings);
  const [reminders, setReminders] = useState<CouponReminder[]>(loadCouponReminders);
  const [planTarget, setPlanTarget] = useState<Campaign | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [filter, setFilter] = useState<ReminderFilter>("all");

  const commitReminders = (next: CouponReminder[]) => {
    setReminders(next);
    writeJson(KEYS.couponReminders, next);
  };

  const updateReminders = (updater: (previous: CouponReminder[]) => CouponReminder[]) => {
    setReminders((previous) => {
      const next = updater(previous);
      writeJson(KEYS.couponReminders, next);
      return next;
    });
  };

  const patchConfig = (patch: Partial<CouponReminderSettings>) => {
    const next = { ...config, ...patch };
    setConfig(next);
    writeJson(KEYS.couponReminderSettings, next);
  };

  useEffect(() => {
    const stored = loadCouponReminders();
    const created = autoPlanReminders(stored, loadCouponReminderSettings());
    if (!created.length) return;
    const next = [...created, ...stored];
    writeJson(KEYS.couponReminders, next);
    setReminders(next);
    setFeedback({
      tone: "info",
      text: `Otomatik hatırlatma açık: ${created.length} kupon için SMS planı oluşturuldu.`,
    });
  }, []);

  const coupons = useMemo(
    () => expiringCoupons(config.daysBefore),
    [config.daysBefore, reminders]
  );

  const due = dueReminders(reminders);
  const recipients = useMemo(() => reminderRecipients(config.segment), [config.segment]);
  const totals = useMemo(() => {
    const planned = reminders.filter((item) => item.status === "scheduled").length;
    const sent = reminders.filter((item) => item.status === "sent").length;
    return { planned, sent };
  }, [reminders]);

  const visibleReminders = useMemo(() => {
    const list = filter === "all" ? reminders : reminders.filter((item) => item.status === filter);
    return [...list].sort((a, b) => {
      if (a.status === "scheduled" && b.status !== "scheduled") return -1;
      if (b.status === "scheduled" && a.status !== "scheduled") return 1;
      return b.sendDate.localeCompare(a.sendDate);
    });
  }, [reminders, filter]);

  const counts: Record<ReminderFilter, number> = {
    all: reminders.length,
    scheduled: totals.planned,
    sent: totals.sent,
    cancelled: reminders.filter((item) => item.status === "cancelled").length,
  };

  const runSend = (target: CouponReminder, currentSettings: NetgsmSettings) => {
    const result = sendReminder(target, currentSettings);
    if (!result.ok) return { ok: false as const, message: result.message, settings: currentSettings };
    if (result.logs.length) onLogs([...result.logs, ...logs]);
    onSettings({ balance: result.balance });
    updateReminders((previous) =>
      previous.map((item) =>
        item.id === target.id
          ? {
              ...item,
              status: "sent" as const,
              sentAt: todayStr(),
              recipients: result.recipients,
              credits: result.credits,
            }
          : item
      )
    );
    return {
      ok: true as const,
      message: `${target.code} hatırlatma SMS'i gönderildi. ${result.recipients} alıcı, ${result.credits} kontör.`,
      settings: { ...currentSettings, balance: result.balance },
    };
  };

  const handleSend = (target: CouponReminder) => {
    const result = runSend(target, settings);
    setFeedback({ tone: result.ok ? "success" : "danger", text: result.message });
  };

  const handleSendDue = () => {
    if (!due.length) {
      setFeedback({ tone: "warning", text: "Vadesi gelen hatırlatma yok." });
      return;
    }
    let current = settings;
    let sentCount = 0;
    let lastError = "";
    due.forEach((target) => {
      if (lastError) return;
      const result = runSend(target, current);
      current = result.settings;
      if (result.ok) sentCount += 1;
      else lastError = result.message;
    });
    setFeedback({
      tone: lastError ? "danger" : "success",
      text: lastError
        ? `${sentCount} hatırlatma gönderildi, sonra durdu: ${lastError}`
        : `${sentCount} vadesi gelen hatırlatma gönderildi.`,
    });
  };

  const cancelReminder = (target: CouponReminder) => {
    updateReminders((previous) =>
      previous.map((item) => (item.id === target.id ? { ...item, status: "cancelled" } : item))
    );
    setFeedback({ tone: "warning", text: `${target.code} hatırlatması iptal edildi.` });
  };

  const removeReminder = (target: CouponReminder) => {
    updateReminders((previous) => previous.filter((item) => item.id !== target.id));
    setFeedback({ tone: "info", text: "Hatırlatma kaydı silindi." });
  };

  return (
    <div className="space-y-4">
      {feedback && (
        <Banner tone={feedback.tone} onClose={() => setFeedback(null)}>
          {feedback.text}
        </Banner>
      )}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi
          icon="ri-alarm-warning-line"
          label="Süresi Yaklaşan"
          value={formatNumberTr(coupons.length)}
          hint={`${config.daysBefore} günden az kalan kupon`}
          tone="warning"
        />
        <Kpi
          icon="ri-calendar-check-line"
          label="Planlanmış"
          value={formatNumberTr(totals.planned)}
          hint={`${due.length} hatırlatma bugün gönderilecek`}
          tone="info"
        />
        <Kpi
          icon="ri-user-received-2-line"
          label="Gönderilebilir"
          value={formatNumberTr(recipients.length)}
          hint="SMS izni olan müşteri"
          tone="success"
        />
        <Kpi
          icon="ri-wallet-3-line"
          label="Kontör Bakiyesi"
          value={formatNumberTr(settings.balance)}
          hint={settings.enabled ? "NetGSM aktif" : "Entegrasyon kapalı · kuyruğa alınır"}
          tone="neutral"
        />
      </div>

      <Panel
        title="Otomatik Hatırlatma Kuralı"
        subtitle="Kupon bitişine yaklaşan müşterilere NetGSM üzerinden hatırlatma SMS'i planlanır"
        icon="ri-robot-2-line"
      >
        <div className="space-y-4">
          <Toggle
            checked={config.autoEnabled}
            onChange={(value) => patchConfig({ autoEnabled: value })}
            label="Süresi yaklaşan kuponlar için otomatik plan oluştur"
            description="Kupon bitişine kalan gün eşiğin altına düştüğünde hatırlatma kuyruğa alınır. Gönderim, aşağıdaki listeden onaylandığında yapılır."
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Kaç gün kala hatırlatılsın" hint="Kuponun bitiş tarihine kalan gün">
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 5, 7].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => patchConfig({ daysBefore: day })}
                    className={`h-9 cursor-pointer whitespace-nowrap rounded-lg px-3 text-xs font-semibold transition-colors ${
                      config.daysBefore === day
                        ? "bg-primary-800 text-background-50"
                        : "bg-background-100 text-foreground-600 hover:bg-background-200"
                    }`}
                  >
                    {day} gün
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Varsayılan alıcı kitlesi">
              <select
                value={config.segment}
                onChange={(event) => patchConfig({ segment: event.target.value as CustomerSegment | "all" })}
                className={inputClass}
              >
                {segmentOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Varsayılan hatırlatma metni" hint="Değişkenler: {ad} {kod} {indirim} {kalan} {link}">
            <select
              value={reminderTemplates.find((template) => template.body === config.template)?.id ?? ""}
              onChange={(event) => {
                const found = reminderTemplates.find((template) => template.id === event.target.value);
                if (found) patchConfig({ template: found.body });
              }}
              className={`${inputClass} mb-2`}
            >
              <option value="">Özel metin</option>
              {reminderTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.label}
                </option>
              ))}
            </select>
            <textarea
              rows={3}
              value={config.template}
              onChange={(event) => patchConfig({ template: event.target.value.slice(0, 480) })}
              className="box-border w-full rounded-lg border border-background-300 bg-background-50 px-3 py-2.5 text-sm leading-relaxed text-foreground-900 outline-none focus:border-primary-500"
            />
          </Field>
        </div>
      </Panel>

      <Panel
        title="Süresi Yaklaşan Kuponlar"
        subtitle={`${coupons.length} kupon · "Kuponlarım" kartındaki uyarı kümesiyle aynı`}
        icon="ri-coupon-3-line"
        padded={false}
        action={
          <button
            type="button"
            onClick={handleSendDue}
            disabled={!due.length}
            className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-xs font-semibold text-background-50 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <i className="ri-send-plane-line" />
            Vadesi Gelenleri Gönder ({due.length})
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-background-200 text-[11px] uppercase tracking-wide text-foreground-500">
                <th className="px-4 py-2.5 font-semibold">Kupon</th>
                <th className="px-3 py-2.5 font-semibold">İndirim</th>
                <th className="px-3 py-2.5 font-semibold">Bitiş</th>
                <th className="px-3 py-2.5 font-semibold">Kalan</th>
                <th className="px-3 py-2.5 font-semibold">Hatırlatma</th>
                <th className="px-4 py-2.5 text-right font-semibold">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((campaign) => {
                const pending = pendingReminderFor(reminders, campaign.id);
                return (
                  <tr key={campaign.id} className="border-b border-background-100 last:border-0">
                    <td className="px-4 py-2.5">
                      <p className="font-mono text-xs font-bold text-primary-900">{campaign.code}</p>
                      <p className="mt-0.5 max-w-[220px] truncate text-[11px] text-foreground-500">{campaign.title}</p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold text-foreground-800">
                      {couponHintLabel(campaign)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-xs text-foreground-600">
                      {formatDateTr(campaign.endDate)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-xs text-foreground-600">
                      {couponExpiryLabel(campaign)}
                    </td>
                    <td className="px-3 py-2.5">
                      {pending ? (
                        <div className="space-y-0.5">
                          <Pill tone="info">Planlandı</Pill>
                          <p className="text-[10px] text-foreground-500">
                            {formatDateTr(pending.sendDate)} · {pending.auto ? "otomatik" : "manuel"}
                          </p>
                        </div>
                      ) : (
                        <Pill tone="neutral">Plan yok</Pill>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {pending && (
                          <button
                            type="button"
                            onClick={() => handleSend(pending)}
                            className="flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg bg-accent-600 px-2.5 text-[11px] font-semibold text-background-50 hover:bg-accent-500"
                          >
                            <i className="ri-send-plane-line" />
                            Gönder
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setPlanTarget(campaign)}
                          className="flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg bg-background-100 px-2.5 text-[11px] font-semibold text-foreground-700 hover:bg-background-200"
                        >
                          <i className="ri-calendar-check-line" />
                          {pending ? "Yeniden Planla" : "Planla"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!coupons.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-foreground-500">
                    Bu eşikte süresi yaklaşan aktif kupon yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="border-t border-background-200 px-4 py-2 text-[11px] text-foreground-500">
          Tahmini maliyet {formatPrice(SMS_UNIT_PRICE)} / kontör · gönderim yalnızca İYS izni olan müşterilere yapılır.
        </p>
      </Panel>

      <Panel
        title="Planlanan Hatırlatmalar"
        subtitle={`${totals.planned} planlandı · ${totals.sent} gönderildi`}
        icon="ri-notification-3-line"
        padded={false}
      >
        <div className="flex flex-wrap gap-1 border-b border-background-200 px-4 py-3">
          {([
            { id: "all", label: "Tümü" },
            { id: "scheduled", label: "Planlandı" },
            { id: "sent", label: "Gönderildi" },
            { id: "cancelled", label: "İptal" },
          ] as Array<{ id: ReminderFilter; label: string }>).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`h-8 cursor-pointer whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors ${
                filter === item.id
                  ? "bg-primary-800 text-background-50"
                  : "bg-background-100 text-foreground-600 hover:bg-background-200"
              }`}
            >
              {item.label}
              <span className="ml-1 opacity-70">{counts[item.id]}</span>
            </button>
          ))}
        </div>

        <ul className="divide-y divide-background-100">
          {visibleReminders.map((reminder) => (
            <li key={reminder.id} className="flex flex-wrap items-start gap-3 px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-900">
                <i className="ri-coupon-3-line" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="font-mono text-xs font-bold text-foreground-950">{reminder.code}</p>
                  <Pill tone={statusTone[reminder.status]}>{statusLabel[reminder.status]}</Pill>
                  {reminder.auto && <Pill tone="warning">Otomatik</Pill>}
                </div>
                <p className="mt-1 line-clamp-2 max-w-2xl text-[11px] leading-relaxed text-foreground-600">
                  {reminder.template}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-foreground-500">
                  <span className="flex items-center gap-1">
                    <i className="ri-calendar-line" />
                    {formatDateTr(reminder.sendDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="ri-user-line" />
                    {reminder.recipients} alıcı
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="ri-coin-line" />
                    {reminder.credits > 0 ? `${reminder.credits} kontör` : "kontör hesaplanacak"}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="ri-time-line" />
                    {reminder.sentAt ? `Gönderildi: ${formatDateTr(reminder.sentAt)}` : `Bitiş: ${formatDateTr(reminder.endDate)}`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {reminder.status === "scheduled" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSend(reminder)}
                      className="flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg bg-accent-600 px-2.5 text-[11px] font-semibold text-background-50 hover:bg-accent-500"
                    >
                      <i className="ri-send-plane-line" />
                      Şimdi Gönder
                    </button>
                    <button
                      type="button"
                      onClick={() => cancelReminder(reminder)}
                      aria-label="Hatırlatmayı iptal et"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-foreground-500 hover:bg-background-200 hover:text-foreground-900"
                    >
                      <i className="ri-close-circle-line" />
                    </button>
                  </>
                )}
                {reminder.status !== "scheduled" && (
                  <button
                    type="button"
                    onClick={() => removeReminder(reminder)}
                    aria-label="Kaydı sil"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-foreground-500 hover:bg-background-200 hover:text-accent-700"
                  >
                    <i className="ri-delete-bin-6-line" />
                  </button>
                )}
              </div>
            </li>
          ))}
          {!visibleReminders.length && (
            <li className="px-4 py-10 text-center text-sm text-foreground-500">
              Bu filtrede hatırlatma kaydı yok.
            </li>
          )}
        </ul>
      </Panel>

      {planTarget && (
        <CouponReminderPlanModal
          campaign={planTarget}
          settings={config}
          onClose={() => setPlanTarget(null)}
          onPlan={(reminder) => {
            commitReminders([reminder, ...reminders]);
            setPlanTarget(null);
            setFeedback({
              tone: "success",
              text: `${reminder.code} için ${formatDateTr(reminder.sendDate)} tarihine hatırlatma planlandı. ${reminder.recipients} alıcı hedeflenecek.`,
            });
          }}
        />
      )}

      <p className="text-[11px] text-foreground-500">
        Planlanan hatırlatmalar NetGSM kuyruğunda bekletilir; gönderim anında kontör düşülür ve kayıt Raporlar
        sekmesine işlenir.
      </p>
    </div>
  );
}