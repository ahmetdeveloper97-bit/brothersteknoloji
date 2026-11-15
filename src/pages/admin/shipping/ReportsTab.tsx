import { useMemo, useState } from "react";
import { Banner, Kpi, Panel, Pill } from "@/components/base/AdminUI";
import { csvStamp, downloadCsv } from "@/lib/csv";
import { formatPrice } from "@/lib/format";
import {
  buildCompanyCsvRows,
  buildCompanyReports,
  buildReportSummary,
  buildShipmentCsvRows,
  filterShipmentsByRange,
  latestShipmentDate,
} from "@/lib/shippingReport";
import type { ReportRange, ReportRangePreset } from "@/lib/shippingReport";
import type { CargoCompany, Shipment } from "@/types/shipping";

interface ReportsTabProps {
  shipments: Shipment[];
  companies: CargoCompany[];
}

type Metric = "volume" | "cost" | "days";

const metricLabels: Array<{ id: Metric; label: string; icon: string }> = [
  { id: "volume", label: "Gönderi Hacmi", icon: "ri-bar-chart-2-line" },
  { id: "cost", label: "Ortalama Maliyet", icon: "ri-wallet-3-line" },
  { id: "days", label: "Teslim Süresi", icon: "ri-timer-line" },
];

const formatDays = (value: number | null): string => (value === null ? "—" : `${value.toFixed(1)} gün`);

const rangePresets: Array<{ id: ReportRangePreset; label: string }> = [
  { id: "7", label: "Son 7 gün" },
  { id: "30", label: "Son 30 gün" },
  { id: "90", label: "Son 90 gün" },
  { id: "all", label: "Tümü" },
  { id: "custom", label: "Özel aralık" },
];

export default function ReportsTab({ shipments, companies }: ReportsTabProps) {
  const [metric, setMetric] = useState<Metric>("volume");
  const [range, setRange] = useState<ReportRange>({ preset: "30", start: "", end: "" });
  const [exportNote, setExportNote] = useState("");

  const filtered = useMemo(() => filterShipmentsByRange(shipments, range), [shipments, range]);
  const reports = useMemo(() => buildCompanyReports(companies, filtered), [companies, filtered]);
  const summary = useMemo(() => buildReportSummary(filtered), [filtered]);
  const dataEnd = useMemo(() => latestShipmentDate(shipments), [shipments]);

  const fastest = useMemo(
    () =>
      [...reports]
        .filter((row) => row.avgDays !== null)
        .sort((a, b) => (a.avgDays ?? 99) - (b.avgDays ?? 99))[0],
    [reports]
  );
  const cheapest = useMemo(() => [...reports].sort((a, b) => a.avgCost - b.avgCost)[0], [reports]);
  const riskiest = useMemo(
    () => [...reports].sort((a, b) => b.returned / Math.max(1, b.total) - a.returned / Math.max(1, a.total))[0],
    [reports]
  );

  const metricValue = (row: (typeof reports)[number]): number => {
    if (metric === "cost") return row.avgCost;
    if (metric === "days") return row.avgDays ?? 0;
    return row.total;
  };
  const maxMetric = Math.max(...reports.map(metricValue), 1);
  const metricText = (row: (typeof reports)[number]): string => {
    if (metric === "cost") return formatPrice(row.avgCost);
    if (metric === "days") return formatDays(row.avgDays);
    return `${row.total} gönderi`;
  };

  const notify = (text: string) => {
    setExportNote(text);
    window.setTimeout(() => setExportNote(""), 4000);
  };

  const exportShipments = () => {
    if (!filtered.length) {
      notify("Seçilen aralıkta dışa aktarılacak gönderi bulunmuyor.");
      return;
    }
    downloadCsv(`kargo-gonderileri-${csvStamp()}.csv`, buildShipmentCsvRows(filtered, companies));
    notify(`${filtered.length} gönderi CSV olarak indirildi.`);
  };

  const exportCompanies = () => {
    if (!reports.length) {
      notify("Seçilen aralıkta firma performansı hesaplanamadı.");
      return;
    }
    downloadCsv(`kargo-firma-performansi-${csvStamp()}.csv`, buildCompanyCsvRows(companies, filtered));
    notify("Firma performans karnesi CSV olarak indirildi.");
  };

  const updateRange = (patch: Partial<ReportRange>) => {
    setRange((current) => ({ ...current, ...patch }));
  };

  return (
    <div className="space-y-4">
      <Banner tone="info">
        Firma performansı, teslim edilen gönderilerin etiket tarihi ile teslim tarihi arasındaki süreye ve taahhüt
        edilen teslim tarihine göre hesaplanır. Skor; zamanında teslim, hız ve maliyetin ağırlıklı ortalamasıdır.
      </Banner>

      <div className="rounded-xl border border-background-200 bg-background-50 px-4 py-3">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground-700">
              <i className="ri-calendar-2-line text-base text-primary-700" />
              Tarih aralığı
            </span>
            <div className="flex flex-wrap items-center gap-1 rounded-lg bg-background-100 p-1">
              {rangePresets.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => updateRange({ preset: item.id })}
                  className={`cursor-pointer whitespace-nowrap rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                    range.preset === item.id
                      ? "bg-background-50 text-foreground-950 shadow-sm"
                      : "text-foreground-600 hover:text-foreground-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {range.preset === "custom" && (
            <div className="flex flex-wrap items-center gap-1.5">
              <input
                type="date"
                value={range.start}
                onChange={(event) => updateRange({ start: event.target.value })}
                aria-label="Başlangıç tarihi"
                className="box-border h-8 rounded-lg border border-background-300 bg-background-50 px-2 text-[11px] text-foreground-900 outline-none focus:border-primary-500"
              />
              <span className="text-[11px] text-foreground-400">—</span>
              <input
                type="date"
                value={range.end}
                onChange={(event) => updateRange({ end: event.target.value })}
                aria-label="Bitiş tarihi"
                className="box-border h-8 rounded-lg border border-background-300 bg-background-50 px-2 text-[11px] text-foreground-900 outline-none focus:border-primary-500"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5 lg:ml-auto">
            <span className="whitespace-nowrap rounded-md bg-background-100 px-2 py-1 text-[11px] text-foreground-600">
              {filtered.length} / {shipments.length} gönderi
            </span>
            <button
              type="button"
              onClick={exportShipments}
              className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-2.5 text-[11px] font-semibold text-foreground-800 hover:bg-background-100"
            >
              <i className="ri-file-download-line" />
              Gönderiler CSV
            </button>
            <button
              type="button"
              onClick={exportCompanies}
              className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-2.5 text-[11px] font-semibold text-background-50 hover:bg-primary-700"
            >
              <i className="ri-file-chart-line" />
              Firma Karnesi CSV
            </button>
          </div>
        </div>

        <p className="mt-2 flex flex-wrap items-center gap-x-2 text-[11px] text-foreground-500">
          <span className="flex items-center gap-1">
            <i className="ri-information-line" />
            Veri bitiş tarihi: {dataEnd.toLocaleDateString("tr-TR")}
          </span>
          {range.preset !== "all" && range.preset !== "custom" && (
            <span className="hidden sm:inline">Son {range.preset} gün içindeki gönderiler raporlanır.</span>
          )}
          {exportNote && (
            <span className="flex items-center gap-1 font-semibold text-accent-800">
              <i className="ri-checkbox-circle-fill" />
              {exportNote}
            </span>
          )}
        </p>
      </div>

      {filtered.length === 0 && (
        <Banner tone="warning">
          Seçilen tarih aralığında gönderi bulunmuyor. Farklı bir aralık seçin veya “Tümü” seçeneğini kullanın.
        </Banner>
      )}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi
          icon="ri-truck-line"
          label="Toplam Gönderi"
          value={String(summary.total)}
          hint={`${reports.length} firma ile çalışılıyor`}
          tone="info"
        />
        <Kpi
          icon="ri-timer-line"
          label="Ort. Teslim Süresi"
          value={formatDays(summary.avgDays)}
          hint="Etiket → teslim arası"
          tone="warning"
        />
        <Kpi
          icon="ri-checkbox-circle-line"
          label="Zamanında Teslim"
          value={summary.onTimeRate === null ? "—" : `%${Math.round(summary.onTimeRate * 100)}`}
          hint={`${summary.delivered} gönderi teslim edildi`}
          tone="success"
        />
        <Kpi
          icon="ri-wallet-3-line"
          label="Ort. Kargo Bedeli"
          value={formatPrice(summary.avgCost)}
          hint={`${summary.returned} iade gönderisi`}
          tone="neutral"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          {
            title: "En Hızlı Firma",
            icon: "ri-rocket-2-line",
            name: fastest?.company.name ?? "—",
            value: fastest ? formatDays(fastest.avgDays) : "—",
            hint: fastest ? `${fastest.delivered} teslim edilen gönderi` : "Yeterli veri yok",
            tone: "bg-accent-50 text-accent-900",
          },
          {
            title: "En Ekonomik Firma",
            icon: "ri-price-tag-3-line",
            name: cheapest?.company.name ?? "—",
            value: cheapest ? formatPrice(cheapest.avgCost) : "—",
            hint: cheapest ? `Ortalama gönderi bedeli` : "Yeterli veri yok",
            tone: "bg-primary-50 text-primary-900",
          },
          {
            title: "İade Riski",
            icon: "ri-error-warning-line",
            name: riskiest?.company.name ?? "—",
            value: riskiest ? `%${Math.round((riskiest.returned / Math.max(1, riskiest.total)) * 100)}` : "—",
            hint: riskiest ? `${riskiest.returned} iade / ${riskiest.total} gönderi` : "Yeterli veri yok",
            tone: "bg-background-200 text-foreground-800",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-background-200 bg-background-50 p-4">
            <div className="flex items-center gap-2">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.tone}`}>
                <i className={`${item.icon} text-base`} />
              </span>
              <p className="text-xs font-medium text-foreground-500">{item.title}</p>
            </div>
            <p className="mt-2.5 truncate text-sm font-semibold text-foreground-950">{item.name}</p>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-1.5">
              <span className="font-heading text-lg font-bold text-foreground-950">{item.value}</span>
              <span className="text-[11px] text-foreground-500">{item.hint}</span>
            </div>
          </div>
        ))}
      </div>

      <Panel
        title="Firma Performans Karnesi"
        subtitle="Skora göre sıralanır · 0-100"
        icon="ri-award-line"
        padded={false}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-background-200 text-[11px] uppercase tracking-wide text-foreground-500">
                <th className="px-4 py-2.5 font-semibold">Kargo Firması</th>
                <th className="px-3 py-2.5 font-semibold">Gönderi</th>
                <th className="px-3 py-2.5 font-semibold">Teslim</th>
                <th className="px-3 py-2.5 font-semibold">İade</th>
                <th className="px-3 py-2.5 font-semibold">Ort. Süre</th>
                <th className="px-3 py-2.5 font-semibold">Zamanında</th>
                <th className="px-3 py-2.5 font-semibold">Ort. Maliyet</th>
                <th className="px-4 py-2.5 font-semibold">Skor</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((row, index) => (
                <tr key={row.company.id} className="border-b border-background-100 last:border-0 hover:bg-background-100/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary-100 text-[9px] font-bold text-primary-900">
                        {row.company.short}
                      </span>
                      <div className="min-w-0">
                        <p className="whitespace-nowrap text-xs font-semibold text-foreground-950">{row.company.name}</p>
                        <p className="text-[10px] text-foreground-500">{row.company.avgDelivery} taahhüt</p>
                      </div>
                      {index === 0 && (
                        <Pill tone="success">
                          <i className="ri-trophy-line" />
                          Lider
                        </Pill>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs text-foreground-800">{row.total}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs text-foreground-800">{row.delivered}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    <span className={row.returned > 0 ? "font-semibold text-foreground-900" : "text-foreground-500"}>
                      {row.returned}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs text-foreground-800">{formatDays(row.avgDays)}</td>
                  <td className="px-3 py-3">
                    {row.onTimeRate === null ? (
                      <span className="text-xs text-foreground-400">—</span>
                    ) : (
                      <Pill tone={row.onTimeRate >= 0.8 ? "success" : row.onTimeRate >= 0.5 ? "warning" : "danger"}>
                        %{Math.round(row.onTimeRate * 100)}
                      </Pill>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs font-semibold text-foreground-950">
                    {formatPrice(row.avgCost)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-background-200">
                        <span
                          className="block h-full rounded-full bg-accent-600"
                          style={{ width: `${Math.round(row.score * 100)}%` }}
                        />
                      </div>
                      <span className="w-7 text-xs font-bold text-foreground-900">{Math.round(row.score * 100)}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-foreground-500">
                    Raporlanacak gönderi bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        title="Firma Karşılaştırması"
        subtitle="Gönderi hacmi, ortalama maliyet ve teslim süresi"
        icon="ri-bar-chart-box-line"
        action={
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-background-100 p-1">
            {metricLabels.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMetric(item.id)}
                className={`flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                  metric === item.id
                    ? "bg-background-50 text-foreground-950 shadow-sm"
                    : "text-foreground-600 hover:text-foreground-900"
                }`}
              >
                <i className={item.icon} />
                {item.label}
              </button>
            ))}
          </div>
        }
      >
        <div className="space-y-2.5">
          {reports.map((row) => {
            const value = metricValue(row);
            const width = Math.max(4, Math.round((value / maxMetric) * 100));
            return (
              <div key={row.company.id} className="flex items-center gap-3">
                <span className="w-28 shrink-0 truncate text-xs font-medium text-foreground-800">{row.company.name}</span>
                <div className="h-3 min-w-0 flex-1 overflow-hidden rounded-full bg-background-100">
                  <span
                    className={`block h-full rounded-full ${
                      metric === "cost" ? "bg-secondary-500" : metric === "days" ? "bg-primary-500" : "bg-accent-600"
                    }`}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="w-24 shrink-0 text-right text-xs font-semibold text-foreground-950">
                  {metricText(row)}
                </span>
              </div>
            );
          })}
          {reports.length === 0 && <p className="py-6 text-center text-sm text-foreground-500">Veri bulunmuyor.</p>}
        </div>
      </Panel>
    </div>
  );
}