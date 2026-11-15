import { useEffect, useMemo, useState } from "react";
import { availableCoupons, couponEndingSoon, couponExpiryLabel, couponHintLabel, evaluateCoupon } from "@/lib/coupons";
import { loadCouponReminderSettings } from "@/lib/couponReminders";
import { formatPrice } from "@/lib/format";
import type { Campaign } from "@/types/admin";
import type { CouponLine } from "@/lib/coupons";

interface CouponSuggestionsProps {
  lines: CouponLine[];
  cartTotal: number;
  appliedCode?: string | null;
  onApply: (code: string) => void;
}

interface SuggestionEntry {
  campaign: Campaign;
  usable: boolean;
  reason: string;
  discount: number;
  freeShipping: boolean;
  label: string;
  shortfall: number;
  endingSoon: boolean;
  expiryLabel: string;
}

export default function CouponSuggestions({ lines, cartTotal, appliedCode, onApply }: CouponSuggestionsProps) {
  const [expanded, setExpanded] = useState(false);
  const smsReminderOn = useMemo(() => loadCouponReminderSettings().autoEnabled, []);

  useEffect(() => {
    setExpanded(false);
  }, [lines.length, cartTotal]);

  const entries = useMemo<SuggestionEntry[]>(() => {
    const campaigns = availableCoupons();
    return campaigns.map((campaign) => {
      const evaluation = evaluateCoupon(campaign.code, lines);
      const shortfall = Math.max(0, campaign.minBasket - cartTotal);
      return {
        campaign,
        usable: evaluation.ok,
        reason: evaluation.ok ? "" : evaluation.message,
        discount: evaluation.discount,
        freeShipping: evaluation.freeShipping,
        label: evaluation.ok ? evaluation.label : couponHintLabel(campaign),
        shortfall,
        endingSoon: couponEndingSoon(campaign),
        expiryLabel: couponExpiryLabel(campaign),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, cartTotal]);

  if (!entries.length) return null;

  const usable = entries.filter((entry) => entry.usable);
  const nearMiss = entries.filter((entry) => !entry.usable);
  const ordered = [...usable, ...nearMiss];
  const visible = expanded ? ordered : ordered.slice(0, 2);
  const expiringCount = entries.filter((entry) => entry.endingSoon).length;

  return (
    <section className="rounded-xl border border-background-200 bg-background-100/70 p-2.5">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full cursor-pointer items-center justify-between gap-2 px-1 py-1 text-left"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-800">
            <i className="ri-coupon-3-line text-xs" />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold text-foreground-900">Kuponlarım</span>
            <span className="block truncate text-[11px] text-foreground-500">
              {usable.length > 0
                ? `${usable.length} kupon bu sepet için geçerli`
                : "Sepetinize uygun kupon aranıyor"}
            </span>
            {expiringCount > 0 && (
              <span className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-secondary-900">
                <i className="ri-timer-flash-line" />
                {expiringCount} kupon yakında sona eriyor
              </span>
            )}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-full bg-background-50 px-2 py-0.5 text-[10px] font-semibold text-foreground-700">
            {entries.length}
          </span>
          <i
            className={`${
              expanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"
            } text-base text-foreground-500`}
          />
        </span>
      </button>

      <ul className={`mt-1.5 space-y-1.5 ${expanded ? "max-h-52 overflow-y-auto pr-0.5" : ""}`}>
        {visible.map(({ campaign, usable: isUsable, reason, discount, freeShipping, label, shortfall, endingSoon, expiryLabel }) => {
          const isApplied = appliedCode === campaign.code;
          return (
            <li
              key={campaign.id}
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 ${
                isUsable
                  ? "border-accent-200 bg-background-50"
                  : "border-background-200 bg-background-50/60"
              } ${
                endingSoon && isUsable ? "ring-1 ring-secondary-300" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-foreground-900">
                  <span className="truncate">{campaign.code}</span>
                  {isUsable && (
                    <span className="shrink-0 rounded bg-accent-100 px-1.5 py-0.5 text-[10px] font-semibold text-accent-900">
                      {label}
                    </span>
                  )}
                  {endingSoon && (
                    <span
                      className="flex shrink-0 items-center gap-1 rounded bg-secondary-100 px-1.5 py-0.5 text-[10px] font-semibold text-secondary-950"
                      title={`${campaign.endDate} tarihinde sona eriyor`}
                    >
                      <i className="ri-timer-line" />
                      {expiryLabel}
                    </span>
                  )}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-foreground-500">
                  {isUsable
                    ? freeShipping
                      ? "Bu sepette kargo bedeli sıfırlanır"
                      : `${formatPrice(discount)} indirim uygulanır`
                    : shortfall > 0
                      ? `${formatPrice(shortfall)} daha ekleyin · ${reason}`
                      : reason}
                </p>
                {endingSoon && (
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-secondary-900">
                    <i className="ri-alarm-warning-line" />
                    {smsReminderOn
                      ? "Yakında sona eriyor — bitmeden size SMS ile hatırlatacağız."
                      : "Yakında sona eriyor — kaçırmadan kullanın."}
                  </p>
                )}
              </div>
              <button
                type="button"
                disabled={!isUsable || isApplied}
                onClick={() => onApply(campaign.code)}
                className={`h-7 shrink-0 whitespace-nowrap rounded-md px-2.5 text-[11px] font-semibold transition-colors ${
                  isApplied
                    ? "cursor-default bg-background-200 text-foreground-600"
                    : isUsable
                      ? "cursor-pointer bg-primary-800 text-background-50 hover:bg-primary-700"
                      : "cursor-not-allowed border border-background-300 text-foreground-400"
                }`}
              >
                {isApplied ? "Uygulandı" : isUsable ? "Uygula" : "Yetersiz"}
              </button>
            </li>
          );
        })}
      </ul>

      {ordered.length > 2 && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-1.5 flex w-full cursor-pointer items-center justify-center gap-1 rounded-md py-1 text-[11px] font-medium text-foreground-600 hover:text-foreground-900"
        >
          {expanded ? "Daralt" : `${ordered.length - 2} kupon daha gör`}
          <i className={expanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} />
        </button>
      )}
    </section>
  );
}