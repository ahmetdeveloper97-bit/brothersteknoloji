import { useCallback, useEffect, useState } from "react";
import { Kpi, Panel } from "@/components/base/AdminUI";
import TicketList from "@/pages/admin/tickets/TicketList";
import TicketDetail from "@/pages/admin/tickets/TicketDetail";
import { STATUS_META, adminListTickets } from "@/lib/supportTickets";
import type { SupportTicketSummary, TicketCounts, TicketStatus } from "@/types/supportTicket";

type FilterKey = "all" | TicketStatus;

const filters: Array<{ key: FilterKey; label: string; icon: string }> = [
  { key: "all", label: "Tümü", icon: "ri-list-check-2" },
  { key: "open", label: "Yeni", icon: "ri-mail-unread-line" },
  { key: "customer_reply", label: "Müşteri Yanıtladı", icon: "ri-reply-line" },
  { key: "answered", label: "Yanıtlandı", icon: "ri-check-double-line" },
  { key: "closed", label: "Kapatıldı", icon: "ri-lock-line" },
];

const emptyCounts: TicketCounts = { all: 0, open: 0, answered: 0, customer_reply: 0, closed: 0 };

export default function TicketsPanel() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [tickets, setTickets] = useState<SupportTicketSummary[]>([]);
  const [counts, setCounts] = useState<TicketCounts>(emptyCounts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeId, setActiveId] = useState("");

  const load = useCallback(
    async (status: FilterKey, term: string) => {
      setLoading(true);
      setError("");
      try {
        const result = await adminListTickets(status === "all" ? "" : status, term);
        if (!result.ok || !result.data) {
          setError(result.message ?? "Talepler yüklenemedi.");
          setTickets([]);
          setCounts(emptyCounts);
          return;
        }
        setTickets(result.data.tickets);
        setCounts(result.data.counts ?? emptyCounts);
        setActiveId((current) => {
          if (current && result.data?.tickets.some((ticket) => ticket.id === current)) return current;
          return result.data?.tickets[0]?.id ?? "";
        });
      } catch {
        setError("Bağlantı kurulamadı. Lütfen tekrar deneyin.");
        setTickets([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load(filter, search.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [filter, search, load]);

  const refresh = () => void load(filter, search.trim());

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi
          icon="ri-mail-unread-line"
          label="Yeni Talep"
          value={String(counts.open)}
          hint="Henüz yanıtlanmadı"
          tone="warning"
        />
        <Kpi
          icon="ri-reply-line"
          label="Müşteri Yanıtladı"
          value={String(counts.customer_reply)}
          hint="Ek bilgi bekliyor"
          tone="info"
        />
        <Kpi
          icon="ri-check-double-line"
          label="Yanıtlandı"
          value={String(counts.answered)}
          hint="Müşteri dönüşü bekleniyor"
          tone="success"
        />
        <Kpi
          icon="ri-ticket-2-line"
          label="Toplam Talep"
          value={String(counts.all)}
          hint={`${counts.closed} talep kapatıldı`}
          tone="neutral"
        />
      </div>

      {error && (
        <div className="flex flex-col gap-2 rounded-lg border border-secondary-300 bg-secondary-50 px-3.5 py-3 text-xs text-secondary-950 sm:flex-row sm:items-center">
          <i className="ri-error-warning-line text-base" />
          <span className="min-w-0 flex-1">{error}</span>
          <button
            type="button"
            onClick={refresh}
            className="flex h-8 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-[11px] font-semibold text-background-50 hover:bg-primary-700"
          >
            <i className="ri-refresh-line" />
            Tekrar dene
          </button>
        </div>
      )}

      <Panel
        title="Destek Talepleri"
        subtitle="Müşteri taleplerini yanıtlayın, dosyaları inceleyin ve durumu güncelleyin"
        icon="ri-customer-service-2-line"
        padded={false}
        action={
          <button
            type="button"
            onClick={refresh}
            className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-2.5 text-[11px] font-semibold text-foreground-700 hover:bg-background-100"
          >
            <i className="ri-refresh-line" />
            Yenile
          </button>
        }
      >
        <div className="flex flex-col gap-2 border-b border-background-200 px-3 py-3 md:flex-row md:items-center md:px-4">
          <div className="no-scrollbar flex flex-1 gap-1 overflow-x-auto">
            {filters.map((item) => {
              const active = filter === item.key;
              const count = item.key === "all" ? counts.all : counts[item.key];
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFilter(item.key)}
                  className={`flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                    active
                      ? "bg-primary-800 text-background-50"
                      : "bg-background-100 text-foreground-600 hover:bg-background-200"
                  }`}
                >
                  <i className={item.icon} />
                  {item.label}
                  <span
                    className={`rounded-full px-1.5 text-[10px] font-bold ${
                      active ? "bg-background-50/25 text-background-50" : "bg-background-50 text-foreground-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="relative w-full md:w-64">
            <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Talep no, ad, e-posta ara..."
              className="box-border h-9 w-full rounded-lg border border-background-300 bg-background-50 pl-9 pr-3 text-xs text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[330px_minmax(0,1fr)]">
          <div className="border-b border-background-200 lg:border-b-0 lg:border-r">
            <TicketList
              tickets={tickets}
              activeId={activeId}
              loading={loading}
              onSelect={setActiveId}
            />
          </div>

          <div className="min-h-[420px]">
            {activeId ? (
              <TicketDetail ticketId={activeId} onChanged={refresh} />
            ) : (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center px-6 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background-100 text-foreground-400">
                  <i className="ri-ticket-2-line text-2xl" />
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground-800">Görüntülenecek talep seçin</p>
                <p className="mt-1 max-w-sm text-xs leading-relaxed text-foreground-500">
                  Soldaki listeden bir talep seçtiğinizde müşteri bilgileri, eklediği dosyalar ve yazışma geçmişi
                  burada görünür.
                </p>
                <p className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-foreground-400">
                  {Object.values(STATUS_META).map((item) => (
                    <span key={item.label} className={`rounded-full px-1.5 py-0.5 font-semibold ${item.tone}`}>
                      {item.label}
                    </span>
                  ))}
                </p>
              </div>
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}