import { useMemo, useState } from "react";
import Modal from "@/components/base/Modal";
import { Field, inputClass, textareaClass } from "@/components/base/AdminUI";
import { formatDateTr } from "@/lib/adminStore";
import { couponDaysLeft, couponHintLabel } from "@/lib/coupons";
import { formatPrice } from "@/lib/format";
import { SMS_UNIT_PRICE, smsCharInfo } from "@/lib/smsNotify";
import {
  REMINDER_LINK,
  REMINDER_STORE_NAME,
  buildReminder,
  estimateReminderCredits,
  firstName,
  reminderRecipients,
  reminderTemplates,
  todayStr,
} from "@/lib/couponReminders";
import { fillSegmentTemplate, segmentOptions } from "@/lib/segmentSms";
import type { Campaign, CustomerSegment } from "@/types/admin";
import type { CouponReminder, CouponReminderSettings } from "@/types/couponReminder";

interface CouponReminderPlanModalProps {
  campaign: Campaign;
  settings: CouponReminderSettings;
  onClose: () => void;
  onPlan: (reminder: CouponReminder) => void;
}

export default function CouponReminderPlanModal({
  campaign,
  settings,
  onClose,
  onPlan,
}: CouponReminderPlanModalProps) {
  const daysLeft = Math.max(0, couponDaysLeft(campaign));
  const [segment, setSegment] = useState<CustomerSegment | "all">(settings.segment);
  const [templateId, setTemplateId] = useState(
    reminderTemplates.find((template) => template.body === settings.template)?.id ?? reminderTemplates[0].id
  );
  const [body, setBody] = useState(settings.template);
  const [sendDate, setSendDate] = useState(todayStr());

  const recipients = useMemo(() => reminderRecipients(segment), [segment]);
  const sample = recipients[0] ?? null;

  const preview = fillSegmentTemplate(body.trim() || "Mesaj metni burada görünecek.", {
    ad: sample ? firstName(sample.name) : "Ahmet",
    segment: segmentOptions.find((option) => option.id === segment)?.label ?? "Müşteri",
    kod: campaign.code,
    indirim: couponHintLabel(campaign),
    link: REMINDER_LINK,
    magaza: REMINDER_STORE_NAME,
    kalan: String(daysLeft),
  });
  const info = smsCharInfo(preview);

  const credits = estimateReminderCredits({
    template: body,
    code: campaign.code,
    discountLabel: couponHintLabel(campaign),
    segment,
    daysLeft,
  });

  const applyTemplate = (id: string) => {
    setTemplateId(id);
    const found = reminderTemplates.find((template) => template.id === id);
    if (found) setBody(found.body);
  };

  const handlePlan = () => {
    if (body.trim().length < 10) return;
    onPlan(
      buildReminder(campaign, {
        segment,
        template: body,
        sendDate,
        auto: false,
      })
    );
  };

  return (
    <Modal
      open
      title="Kupon hatırlatma planla"
      subtitle={`${campaign.code} · ${campaign.title}`}
      icon="ri-notification-3-line"
      onClose={onClose}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-9 cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium text-foreground-700 hover:bg-background-100"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={handlePlan}
            disabled={body.trim().length < 10 || recipients.length === 0}
            className="flex h-9 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <i className="ri-calendar-check-line" />
            Hatırlatmayı Planla
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-[11px] text-primary-900">
          <span className="flex items-center gap-1 font-semibold">
            <i className="ri-coupon-3-line" />
            {campaign.code}
          </span>
          <span className="rounded-md bg-background-50 px-1.5 py-0.5 font-semibold">{couponHintLabel(campaign)}</span>
          <span className="flex items-center gap-1">
            <i className="ri-calendar-line" />
            Bitiş: {formatDateTr(campaign.endDate)}
          </span>
          <span className="rounded-md bg-accent-100 px-1.5 py-0.5 font-semibold text-accent-900">
            {daysLeft} gün kaldı
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Gönderim tarihi" hint="Vadesi gelen hatırlatmalar panelden tek tıkla gönderilir">
            <input
              type="date"
              value={sendDate}
              min={todayStr()}
              max={campaign.endDate}
              onChange={(event) => setSendDate(event.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Alıcı kitlesi">
            <select
              value={segment}
              onChange={(event) => setSegment(event.target.value as CustomerSegment | "all")}
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Hazır şablon">
            <select value={templateId} onChange={(event) => applyTemplate(event.target.value)} className={inputClass}>
              {reminderTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tahmini maliyet" hint={`${recipients.length} alıcı · ${credits} kontör`}>
            <p className="flex h-9 items-center rounded-lg bg-background-100 px-3 text-sm font-semibold text-foreground-900">
              {formatPrice(credits * SMS_UNIT_PRICE)}
            </p>
          </Field>
        </div>

        <Field label="SMS metni" hint="Değişkenler: {ad} {kod} {indirim} {kalan} {link}">
          <textarea
            rows={4}
            value={body}
            onChange={(event) => setBody(event.target.value.slice(0, 480))}
            className={textareaClass}
          />
        </Field>

        <div className="rounded-2xl border border-background-300 bg-background-100 p-3">
          <div className="mb-2 flex items-center gap-1.5 text-[10px] text-foreground-500">
            <i className="ri-smartphone-line" />
            Önizleme · {sample?.name ?? "Örnek müşteri"}
          </div>
          <div className="rounded-xl rounded-tl-sm bg-background-50 p-3 text-xs leading-relaxed text-foreground-800 shadow-sm">
            {preview}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-foreground-600">
            <span className="rounded bg-background-50 px-1.5 py-0.5">{info.chars} karakter</span>
            <span className="rounded bg-background-50 px-1.5 py-0.5">{info.parts} SMS / kişi</span>
            <span className="rounded bg-background-50 px-1.5 py-0.5">{recipients.length} alıcı</span>
          </div>
        </div>

        {recipients.length === 0 && (
          <p className="rounded-lg bg-secondary-100 px-3 py-2 text-[11px] font-medium text-secondary-950">
            Bu kitlede SMS izni olan geçerli numaraya sahip müşteri yok. Planlama yapılamaz.
          </p>
        )}
      </div>
    </Modal>
  );
}