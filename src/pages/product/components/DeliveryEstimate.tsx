import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/format";
import { TR_CITIES } from "@/lib/trCities";
import {
  cityZone,
  deliveryDays,
  estimatedDeliveryDate,
  formatShortDate,
  loadCargoCompanies,
  loadShippingSettings,
} from "@/lib/shipping";

export default function DeliveryEstimate() {
  const [settings] = useState(() => loadShippingSettings());
  const [companies] = useState(() => loadCargoCompanies());
  const cities = TR_CITIES;

  const [city, setCity] = useState("İstanbul");
  const company =
    companies.find((item) => item.id === settings.defaultCompanyId && item.enabled) ??
    companies.find((item) => item.enabled);
  const days = deliveryDays(company?.avgDelivery ?? "2-3 gün");
  const eta = estimatedDeliveryDate(days);
  const zone = cityZone(settings, city);
  const isFast = days <= 2;

  return (
    <div className="mt-4 rounded-xl border border-background-200 bg-background-100 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground-950">
          <i className="ri-truck-line text-base text-primary-700" />
          Teslimat Tahmini
        </p>
        <select
          value={city}
          onChange={(event) => setCity(event.target.value)}
          aria-label="Teslimat ili"
          className="h-8 cursor-pointer rounded-md border border-background-300 bg-background-50 px-2 text-xs text-foreground-800 outline-none focus:border-primary-500"
        >
          {cities.map((cityName) => (
            <option key={cityName} value={cityName}>
              {cityName}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2.5 flex flex-wrap items-end gap-x-3 gap-y-1">
        <p className="font-heading text-lg font-bold text-foreground-950">{formatShortDate(eta)}</p>
        <span className="flex items-center gap-1 rounded-full bg-accent-100 px-2 py-0.5 text-[11px] font-semibold text-accent-900">
          <i className={isFast ? "ri-flashlight-line" : "ri-time-line"} />
          {days} iş günü
        </span>
      </div>

      <p className="mt-1.5 text-[11px] leading-relaxed text-foreground-600">
        {company?.name ?? "Anlaşmalı kargo"} ile {zone.name.toLowerCase()} bölgesine gönderim ·{" "}
        {settings.cutoff} öncesi siparişlerde aynı gün kargoda.
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-background-200 pt-2 text-[11px]">
        <span className="flex items-center gap-1 text-foreground-600">
          <i className="ri-gift-line text-accent-600" />
          {settings.freeShippingEnabled
            ? "Tüm siparişlerde kargo ücretsiz"
            : `${formatPrice(settings.freeShippingThreshold)} üzeri kargo ücretsiz`}
        </span>
        <Link to="/kargo-takip" className="flex items-center gap-1 font-semibold text-primary-700 hover:text-primary-900">
          <i className="ri-map-pin-time-line" />
          Kargo takibi
        </Link>
      </div>
    </div>
  );
}