import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Pill } from "@/components/base/AdminUI";
import {
  buildTrackingUrl,
  forwardStatus,
  loadCargoCompanies,
  loadShipments,
  statusMeta,
} from "@/lib/shipping";
import type { Shipment } from "@/types/shipping";

const normalize = (value: string): string => value.toUpperCase().replace(/\s|-/g, "");

const findShipment = (query: string): Shipment | null => {
  const target = normalize(query);
  if (!target) return null;
  return (
    loadShipments().find((shipment) => {
      const tracking = normalize(shipment.tracking);
      const order = normalize(shipment.orderId);
      return tracking.includes(target) || order.includes(target) || target.includes(tracking);
    }) ?? null
  );
};

const samples = ["YK-8842910374", "AR-5520819446", "SND-4412088931"];

export default function TrackingWidget({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<Shipment | null>(() => (initialQuery ? findShipment(initialQuery) : null));
  const [searched, setSearched] = useState(Boolean(initialQuery));
  const [copied, setCopied] = useState(false);

  const companies = loadCargoCompanies();
  const company = result ? companies.find((item) => item.id === result.companyId) : undefined;
  const trackingUrl = result ? buildTrackingUrl(company, result.tracking) : "";
  const currentIndex = result ? forwardStatus.indexOf(result.status) : -1;

  const runSearch = (value: string) => {
    setQuery(value);
    setResult(findShipment(value));
    setSearched(Boolean(value.trim()));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runSearch(query);
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.tracking);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-2xl border border-background-200 bg-background-50 p-4 shadow-sm md:p-6">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-800">
          <i className="ri-truck-line text-lg" />
        </span>
        <div>
          <h2 className="font-heading text-base font-bold text-foreground-950">Kargo Takibi</h2>
          <p className="text-xs text-foreground-500">Takip numarası veya sipariş numarası ile sorgulayın</p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-foreground-400" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSearched(false);
            }}
            placeholder="Örn. YK-8842910374 veya #TR-10482"
            aria-label="Takip numarası"
            className="box-border h-11 w-full rounded-lg border border-background-300 bg-background-50 pl-9 pr-3 text-sm text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-300"
          />
        </div>
        <button
          type="submit"
          className="flex h-11 shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-5 text-sm font-semibold text-background-50 hover:bg-primary-700"
        >
          <i className="ri-search-2-line" />
          Sorgula
        </button>
      </form>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-foreground-400">Örnek:</span>
        {samples.map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => runSearch(sample)}
            className="cursor-pointer whitespace-nowrap rounded-full border border-background-300 bg-background-100 px-2 py-0.5 font-mono text-[10px] text-foreground-600 hover:border-primary-300 hover:text-primary-800"
          >
            {sample}
          </button>
        ))}
      </div>

      {searched && !result && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-secondary-300 bg-secondary-100 px-3 py-2.5 text-xs text-secondary-950">
          <i className="ri-error-warning-line mt-0.5 text-sm" />
          <span>
            Bu numaraya ait gönderi bulunamadı. Takip numarasını kontrol edin veya{" "}
            <Link to="/kategoriler" className="font-semibold underline">
              siparişlerinizden
            </Link>{" "}
            tekrar deneyin.
          </span>
        </div>
      )}

      {result && (
        <div className="mt-4 overflow-hidden rounded-xl border border-background-200">
          <div className="flex flex-wrap items-start justify-between gap-2 bg-background-100 px-3.5 py-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-100 text-[9px] font-bold text-primary-900">
                  {company?.short ?? "KRG"}
                </span>
                <p className="truncate text-sm font-semibold text-foreground-950">{company?.name ?? "Kargo"}</p>
                <Pill tone={statusMeta[result.status].tone}>
                  <i className={statusMeta[result.status].icon} />
                  {statusMeta[result.status].label}
                </Pill>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-foreground-600">
                <span className="flex items-center gap-1 font-mono font-semibold text-foreground-900">
                  {result.tracking}
                  <button
                    type="button"
                    onClick={copy}
                    aria-label="Takip numarasını kopyala"
                    className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-foreground-500 hover:bg-background-200"
                  >
                    <i className={copied ? "ri-check-line text-accent-700" : "ri-file-copy-line"} />
                  </button>
                </span>
                <span className="flex items-center gap-1">
                  <i className="ri-shopping-bag-3-line" />
                  {result.orderId}
                </span>
                <span className="flex items-center gap-1">
                  <i className="ri-map-pin-2-line" />
                  {result.city}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wide text-foreground-400">Tahmini Teslim</p>
              <p className="text-xs font-semibold text-foreground-950">{result.eta}</p>
            </div>
          </div>

          <div className="px-3.5 py-3">
            <ol className="space-y-0">
              {forwardStatus.map((status, index) => {
                const done = result.status === "returned" ? true : index <= currentIndex;
                const current = result.status !== "returned" && index === currentIndex;
                const movement = [...result.history].reverse().find((item) => item.status === status);
                return (
                  <li key={status} className="flex gap-2.5 pb-2.5 last:pb-0">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] ${
                          done
                            ? "bg-accent-600 text-background-50"
                            : "border border-background-300 bg-background-50 text-foreground-400"
                        } ${current ? "ring-2 ring-accent-300" : ""}`}
                      >
                        <i className={statusMeta[status].icon} />
                      </span>
                      {index < forwardStatus.length - 1 && (
                        <span className={`mt-1 h-full w-px flex-1 ${done ? "bg-accent-300" : "bg-background-200"}`} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold ${done ? "text-foreground-900" : "text-foreground-400"}`}>
                        {statusMeta[status].label}
                      </p>
                      <p className="mt-0.5 text-[11px] text-foreground-500">
                        {movement ? `${movement.date} · ${movement.location}` : "Bekliyor"}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {result.status === "returned" && (
              <p className="mt-1 flex items-start gap-1.5 rounded-lg bg-foreground-100 px-2.5 py-2 text-[11px] text-foreground-800">
                <i className="ri-arrow-go-back-line mt-0.5" />
                Gönderi iade sürecinde, ürün depomuza ulaştığında ücret iadesi 3 iş günü içinde yapılır.
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-background-200 pt-2.5">
              <p className="text-[11px] text-foreground-500">
                Son güncelleme: {result.history[result.history.length - 1]?.date ?? result.date}
              </p>
              {trackingUrl && (
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold text-primary-700 hover:text-primary-900"
                >
                  <i className="ri-external-link-line" />
                  {company?.name ?? "Kargo"} sitesinde görüntüle
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {!searched && !result && (
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-foreground-500">
          <i className="ri-shield-check-line" />
          Kargo durumu her 15 dakikada bir otomatik olarak güncellenir.
          <span className="hidden sm:inline">Kargo firması durum değişikliğinde SMS ile bilgilendirme yapılır.</span>
        </p>
      )}
    </div>
  );
}