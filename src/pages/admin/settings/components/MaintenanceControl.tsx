import { Banner, Panel, Pill, Toggle } from "@/components/base/AdminUI";
import {
  DEFAULT_MAINTENANCE_SECONDS,
  formatRemainingText,
  pad2,
  startMaintenance,
  stopMaintenance,
  useCountdown,
  useMaintenanceConfig,
} from "@/lib/maintenance";

const durationOptions: Array<{ label: string; seconds: number }> = [
  { label: "1 saat", seconds: 60 * 60 },
  { label: "3 sa 27 dk 45 sn", seconds: DEFAULT_MAINTENANCE_SECONDS },
  { label: "6 saat", seconds: 6 * 60 * 60 },
  { label: "24 saat", seconds: 24 * 60 * 60 },
];

export default function MaintenanceControl() {
  const config = useMaintenanceConfig();
  const remaining = useCountdown(config.endsAt);
  const running = config.enabled && remaining.total > 0;

  return (
    <Panel title="Bakım Modu" subtitle="Mağaza kapanırken ziyaretçilere geri sayımlı ekran gösterilir" icon="ri-tools-line">
      <div className="space-y-3">
        <Toggle
          checked={config.enabled}
          onChange={(value) => {
            if (value) {
              startMaintenance(DEFAULT_MAINTENANCE_SECONDS);
            } else {
              stopMaintenance();
            }
          }}
          label="Bakım modu aktif"
          description="Yönetim paneli (/arteadmin) bakım modundan etkilenmez, her zaman açık kalır."
        />

        <div className="flex items-center gap-3 rounded-xl border border-background-200 bg-background-100 px-3 py-3">
          <div className="flex items-end gap-1 font-heading text-2xl font-extrabold tabular-nums text-foreground-950">
            <span>{pad2(remaining.hours)}</span>
            <span className="pb-1 text-sm text-foreground-400">:</span>
            <span>{pad2(remaining.minutes)}</span>
            <span className="pb-1 text-sm text-foreground-400">:</span>
            <span>{pad2(remaining.seconds)}</span>
          </div>
          <div className="ml-auto text-right">
            <Pill tone={running ? "warning" : "neutral"}>{running ? "Ziyaretçiye kapalı" : "Yayında"}</Pill>
            <p className="mt-1 text-[10px] text-foreground-500">
              {running ? formatRemainingText(config.endsAt - Date.now()) : "Sayaç durdu"}
            </p>
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[11px] font-medium text-foreground-600">Sayaç süresini başlat</p>
          <div className="flex flex-wrap gap-1.5">
            {durationOptions.map((option) => (
              <button
                key={option.seconds}
                type="button"
                onClick={() => startMaintenance(option.seconds)}
                className="h-8 cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-3 text-[11px] font-semibold text-foreground-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => startMaintenance(DEFAULT_MAINTENANCE_SECONDS)}
            className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3.5 text-[11px] font-semibold text-background-50 hover:bg-primary-700"
          >
            <i className="ri-restart-line" />
            Sayacı sıfırla ve başlat
          </button>
          <button
            type="button"
            onClick={() => stopMaintenance()}
            disabled={!config.enabled}
            className={`flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-3.5 text-[11px] font-semibold ${
              config.enabled
                ? "cursor-pointer text-foreground-700 hover:bg-background-100"
                : "cursor-not-allowed text-foreground-400"
            }`}
          >
            <i className="ri-rocket-2-line" />
            Siteyi hemen yayına al
          </button>
        </div>

        <Banner tone="info">
          Sayaç sıfıra düştüğünde mağaza kendiliğinden yayına döner. Ziyaretçiler bakım ekranında kalan süreyi canlı
          olarak görür.
        </Banner>
      </div>
    </Panel>
  );
}