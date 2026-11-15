import { useMemo, useState } from "react";
import { Kpi, Panel, Pill, inputClass } from "@/components/base/AdminUI";
import type { Tone } from "@/components/base/AdminUI";
import type { SmsMessage, SmsStatus } from "@/types/integrations";

const statusMeta: Record<SmsStatus, { label: string; tone: Tone }> = {
  delivered: { label: "İletildi", tone: "success" },
  queued: { label: "Kuyrukta", tone: "warning" },
  failed: { label: "Başarısız", tone: "danger" },
};

interface SmsReportsTabProps {
  logs: SmsMessage[];
}

export default function SmsReportsTab({ logs }: SmsReportsTabProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | SmsStatus>("all");

  const stats = useMemo(
    () => ({
      total: logs.length,
      delivered: logs.filter((log) => log.status === "delivered").length,
      failed: logs.filter((log) => log.status === "failed").length,
      queued: logs.filter((log) => log.status === "queued").length,
    }),
    [logs]
  );

  const visible = logs.filter((log) => {
    const matchesStatus = status === "all" || log.status === status;
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      log.name.toLowerCase().includes(query) ||
      log.to.includes(query) ||
      log.body.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi icon="ri-send-plane-line" label="Toplam SMS" value={String(stats.total)} hint="Son 30 gün" tone="info" />
        <Kpi icon="ri-check-double-line" label="İletilen" value={String(stats.delivered)} hint="NetGSM raporu" tone="success" />
        <Kpi icon="ri-time-line" label="Kuyrukta" value={String(stats.queued)} hint="Gönderim bekliyor" tone="warning" />
        <Kpi icon="ri-error-warning-line" label="Başarısız" value={String(stats.failed)} hint="Numara/İYS hatası" tone="danger" />
      </div>

      <Panel
        title="Gönderim Raporu"
        subtitle="Teslimat durumlarını takip edin"
        icon="ri-file-chart-line"
        padded={false}
        action={
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Numara veya isim ara..."
              className={`${inputClass} h-9 w-40 text-xs`}
            />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as "all" | SmsStatus)}
              className="h-9 cursor-pointer rounded-lg border border-background-300 bg-background-50 px-2 text-xs text-foreground-800 outline-none"
            >
              <option value="all">Tümü</option>
              <option value="delivered">İletildi</option>
              <option value="queued">Kuyrukta</option>
              <option value="failed">Başarısız</option>
            </select>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-background-200 text-[11px] uppercase tracking-wide text-foreground-500">
                <th className="px-4 py-2.5 font-semibold">Alıcı</th>
                <th className="px-3 py-2.5 font-semibold">Mesaj</th>
                <th className="px-3 py-2.5 font-semibold">Başlık</th>
                <th className="px-3 py-2.5 font-semibold">Tarih</th>
                <th className="px-4 py-2.5 font-semibold">Durum</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((log) => (
                <tr key={log.id} className="border-b border-background-100 last:border-0 hover:bg-background-100/60">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground-950">{log.name}</p>
                    <p className="mt-0.5 text-[11px] text-foreground-500">{log.to}</p>
                  </td>
                  <td className="max-w-[260px] px-3 py-3">
                    <p className="truncate text-xs text-foreground-700">{log.body}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-[11px] text-foreground-600">{log.header}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-[11px] text-foreground-600">{log.date}</td>
                  <td className="px-4 py-3">
                    <Pill tone={statusMeta[log.status].tone}>{statusMeta[log.status].label}</Pill>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-foreground-500">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}