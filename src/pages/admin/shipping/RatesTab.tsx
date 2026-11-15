import { useState } from "react";
import { Banner, Field, Panel, Toggle, inputClass } from "@/components/base/AdminUI";
import { formatPrice } from "@/lib/format";
import { TR_CITIES } from "@/lib/trCities";
import { calculateCargoPrice, cityZone, desiFromDimensions } from "@/lib/shipping";
import type { CargoCompany, CargoTariff, ShippingSettings } from "@/types/shipping";

interface RatesTabProps {
  companies: CargoCompany[];
  tariffs: CargoTariff[];
  settings: ShippingSettings;
  onTariffs: (next: CargoTariff[]) => void;
  onSettings: (patch: Partial<ShippingSettings>) => void;
}

export default function RatesTab({ companies, tariffs, settings, onTariffs, onSettings }: RatesTabProps) {
  const [width, setWidth] = useState("30");
  const [height, setHeight] = useState("20");
  const [length, setLength] = useState("15");
  const [weight, setWeight] = useState("1");
  const [quantity, setQuantity] = useState("1");
  const [city, setCity] = useState("İstanbul");
  const [cod, setCod] = useState(false);
  const [insurance, setInsurance] = useState(true);

  const allCities = TR_CITIES;
  const zone = cityZone(settings, city);

  const volumetric = desiFromDimensions(Number(width) || 0, Number(height) || 0, Number(length) || 0);
  const totalDesi = Math.max(0.1, Math.round(Math.max(volumetric, Number(weight) || 0) * (Number(quantity) || 1) * 10) / 10);

  const comparison = companies
    .filter((company) => company.enabled)
    .map((company) => {
      const tariff = tariffs.find((item) => item.companyId === company.id);
      return {
        company,
        tariff,
        price: calculateCargoPrice(tariff, totalDesi, { zoneMultiplier: zone.multiplier, cod, insurance }),
      };
    })
    .filter((item) => Boolean(item.tariff))
    .sort((a, b) => a.price - b.price);

  const cheapest = comparison[0];

  const updateTariff = (companyId: string, patch: Partial<CargoTariff>) => {
    onTariffs(tariffs.map((tariff) => (tariff.companyId === companyId ? { ...tariff, ...patch } : tariff)));
  };

  const updateZone = (zoneId: string, patch: Partial<ShippingSettings["zones"][number]>) => {
    onSettings({
      zones: settings.zones.map((item) => (item.id === zoneId ? { ...item, ...patch } : item)),
    });
  };

  return (
    <div className="space-y-4">
      <Banner tone={settings.freeShippingEnabled ? "success" : "info"}>
        Fiyatlar <span className="font-semibold">taban ücret + ek desi ücreti</span> olarak hesaplanır. Bölge çarpanı,
        kapıda ödeme ve sigorta bedeli otomatik eklenir.{" "}
        {settings.freeShippingEnabled ? (
          <span className="font-semibold">Ücretsiz kargo modu açık: tüm siparişlerde kargo ücretsizdir.</span>
        ) : (
          <>Mağazada {formatPrice(settings.freeShippingThreshold)} üzeri siparişlerde kargo ücretsizdir.</>
        )}
      </Banner>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Panel className="xl:col-span-2" title="Desi & Fiyat Hesaplayıcı" icon="ri-calculator-line">
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <Field label="En (cm)">
                <input value={width} onChange={(event) => setWidth(event.target.value)} type="number" className={inputClass} />
              </Field>
              <Field label="Boy (cm)">
                <input value={height} onChange={(event) => setHeight(event.target.value)} type="number" className={inputClass} />
              </Field>
              <Field label="Yük. (cm)">
                <input value={length} onChange={(event) => setLength(event.target.value)} type="number" className={inputClass} />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Field label="Ağırlık (kg)">
                <input value={weight} onChange={(event) => setWeight(event.target.value)} type="number" className={inputClass} />
              </Field>
              <Field label="Adet">
                <input value={quantity} onChange={(event) => setQuantity(event.target.value)} type="number" className={inputClass} />
              </Field>
              <Field label="Desi">
                <div className="flex h-10 items-center rounded-lg bg-primary-50 px-3 text-sm font-bold text-primary-900">
                  {totalDesi}
                </div>
              </Field>
            </div>

            <Field label="Teslimat ili">
              <select value={city} onChange={(event) => setCity(event.target.value)} className={inputClass}>
                {allCities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <p className="rounded-lg bg-background-100 px-3 py-2 text-[11px] text-foreground-600">
              {zone.name} · çarpan <span className="font-semibold text-foreground-900">x{zone.multiplier}</span>
              {volumetric > 0 && ` · hacimsel desi ${volumetric}`}
            </p>

            <div className="space-y-2.5 rounded-lg bg-background-100 p-3">
              <Toggle checked={cod} onChange={setCod} label="Kapıda ödeme" description="Kapıda ödeme hizmet bedeli eklenir." />
              <Toggle checked={insurance} onChange={setInsurance} label="Gönderi sigortası" description="Bedelin %4'ü (min 8,90 ₺)." />
            </div>
          </div>
        </Panel>

        <Panel
          className="xl:col-span-3"
          title="Firma Karşılaştırması"
          subtitle={`${totalDesi} desi · ${city}`}
          icon="ri-scales-3-line"
          padded={false}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-background-200 text-[11px] uppercase tracking-wide text-foreground-500">
                  <th className="px-4 py-2.5 font-semibold">Kargo Firması</th>
                  <th className="px-3 py-2.5 font-semibold">Süre</th>
                  <th className="px-3 py-2.5 font-semibold">Kapıda</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Tahmini Bedel</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((item, index) => (
                  <tr
                    key={item.company.id}
                    className={`border-b border-background-100 last:border-0 ${
                      cheapest?.company.id === item.company.id ? "bg-accent-50/60" : "hover:bg-background-100/60"
                    }`}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-primary-100 text-[9px] font-bold text-primary-900">
                          {item.company.short}
                        </span>
                        <span className="whitespace-nowrap text-xs font-medium text-foreground-900">{item.company.name}</span>
                        {index === 0 && (
                          <span className="rounded-full bg-accent-600 px-1.5 py-0.5 text-[9px] font-bold text-background-50">
                            EN UYGUN
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-[11px] text-foreground-600">{item.company.avgDelivery}</td>
                    <td className="px-3 py-2.5 text-[11px] text-foreground-600">
                      {item.company.supportsCod ? "Var" : "Yok"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right text-xs font-semibold text-foreground-950">
                      {formatPrice(item.price)}
                    </td>
                  </tr>
                ))}
                {comparison.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-sm text-foreground-500">
                      Aktif kargo firması tanımlı değil.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {cheapest && (
            <p className="border-t border-background-200 px-4 py-2.5 text-[11px] text-foreground-600">
              En uygun seçenek: <span className="font-semibold text-foreground-900">{cheapest.company.name}</span> ·{" "}
              {formatPrice(cheapest.price)} · {cheapest.company.avgDelivery} teslimat
            </p>
          )}
        </Panel>
      </div>

      <Panel
        title="Kargo Tarifeleri"
        subtitle="Firma bazlı taban ücret, desi ücreti ve ek hizmet bedelleri"
        icon="ri-money-dollar-circle-line"
        padded={false}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-background-200 text-[11px] uppercase tracking-wide text-foreground-500">
                <th className="px-4 py-2.5 font-semibold">Firma</th>
                <th className="px-3 py-2.5 font-semibold">Taban (₺)</th>
                <th className="px-3 py-2.5 font-semibold">Ek desi (₺)</th>
                <th className="px-3 py-2.5 font-semibold">Kapıda ödeme (₺)</th>
                <th className="px-3 py-2.5 font-semibold">İade (₺)</th>
                <th className="px-4 py-2.5 text-right font-semibold">3 desi örnek</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => {
                const tariff = tariffs.find((item) => item.companyId === company.id);
                if (!tariff) return null;
                return (
                  <tr key={company.id} className="border-b border-background-100 last:border-0 hover:bg-background-100/60">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-background-200 text-[9px] font-bold text-foreground-800">
                          {company.short}
                        </span>
                        <span className="whitespace-nowrap text-xs font-medium text-foreground-900">{company.name}</span>
                        {!company.enabled && <span className="text-[10px] text-foreground-400">(pasif)</span>}
                      </div>
                    </td>
                    {(["basePrice", "perDesi", "codFee", "returnFee"] as const).map((field) => (
                      <td key={field} className="px-3 py-2">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={tariff[field]}
                          onChange={(event) => updateTariff(company.id, { [field]: Number(event.target.value) || 0 })}
                          className="h-8 w-20 rounded-md border border-background-300 bg-background-50 px-2 text-xs text-foreground-900 outline-none focus:border-primary-500"
                        />
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-4 py-2.5 text-right text-xs font-semibold text-foreground-950">
                      {formatPrice(calculateCargoPrice(tariff, 3))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Bölge Çarpanları" subtitle="Teslimat iline göre fiyat farkı" icon="ri-map-2-line">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {settings.zones.map((item) => (
            <div key={item.id} className="rounded-xl border border-background-200 bg-background-100 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-foreground-900">{item.name}</p>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-foreground-500">x</span>
                  <input
                    type="number"
                    step="0.05"
                    min="1"
                    value={item.multiplier}
                    onChange={(event) => updateZone(item.id, { multiplier: Number(event.target.value) || 1 })}
                    className="h-7 w-16 rounded-md border border-background-300 bg-background-50 px-1.5 text-xs font-semibold text-foreground-900 outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {item.cities.slice(0, 6).map((cityName) => (
                  <span key={cityName} className="rounded-full bg-background-50 px-1.5 py-0.5 text-[10px] text-foreground-600">
                    {cityName}
                  </span>
                ))}
                {item.cities.length > 6 && (
                  <span className="rounded-full bg-background-50 px-1.5 py-0.5 text-[10px] text-foreground-500">
                    +{item.cities.length - 6}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}