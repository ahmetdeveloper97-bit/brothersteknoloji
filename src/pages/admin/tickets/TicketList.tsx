import { PRIORITY_META, STATUS_META, categoryLabel, formatTicketShortDate } from "@/lib/supportTickets";
import type { SupportTicketSummary } from "@/types/supportTicket";

interface TicketListProps {
  tickets: SupportTicketSummary[];
  activeId: string;
  loading: boolean;
  onSelect: (id: string) => void;
}

export default function TicketList({ tickets, activeId, loading, onSelect }: TicketListProps) {
  if (loading) {
    return (
      <div className="space-y-2 p-3">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-20 animate-pulse rounded-lg border border-background-200 bg-background-100" />
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <i className="ri-inbox-line mb-2 block text-3xl text-foreground-300" />
        <p className="text-sm font-medium text-foreground-700">Bu filtrede talep bulunmuyor</p>
        <p className="mt-1 text-[11px] leading-relaxed text-foreground-500">
          Müşteriler destek merkezinden talep oluşturduğunda burada listelenir.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[720px] overflow-y-auto p-2">
      <div className="space-y-1.5">
        {tickets.map((ticket) => {
          const active = ticket.id === activeId;
          const status = STATUS_META[ticket.status];
          return (
            <button
              key={ticket.id}
              type="button"
              onClick={() => onSelect(ticket.id)}
              className={`w-full cursor-pointer rounded-lg border px-3 py-2.5 text-left transition-colors ${
                active
                  ? "border-primary-400 bg-primary-50"
                  : "border-background-200 bg-background-50 hover:border-background-300 hover:bg-background-100"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold text-primary-800">{ticket.ticketNo}</span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${status.tone}`}>
                      <i className={status.icon} />
                      {status.label}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-xs font-semibold text-foreground-950">{ticket.subject}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 truncate text-[10px] text-foreground-500">
                    <i className="ri-user-3-line" />
                    {ticket.name}
                    <span className="text-foreground-300">·</span>
                    {categoryLabel(ticket.category)}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${PRIORITY_META[ticket.priority].tone}`}
                  >
                    {PRIORITY_META[ticket.priority].label}
                  </span>
                  <span className="text-[9px] text-foreground-400">{formatTicketShortDate(ticket.lastMessageAt)}</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}