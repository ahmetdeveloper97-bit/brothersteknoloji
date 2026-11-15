import { useEffect, useState } from "react";
import { readJson, writeJson } from "@/lib/persistent";

export interface MaintenanceConfig {
  enabled: boolean;
  endsAt: number;
  title: string;
  message: string;
}

export const MAINTENANCE_KEY = "eticaretv8_maintenance";
export const MAINTENANCE_EVENT = "eticaretv8:maintenance-updated";

/** 3 saat 27 dakika 45 saniye */
export const DEFAULT_MAINTENANCE_SECONDS = 3 * 3600 + 27 * 60 + 45;

export const DEFAULT_MAINTENANCE_TITLE = "Site yayına alınıyor";
export const DEFAULT_MAINTENANCE_MESSAGE =
  "Mağaza altyapımızı yeniliyoruz. Sipariş ve ödeme sistemleri kısa bir süre sonra daha hızlı ve daha güvenli şekilde tekrar hizmetinizde olacak.";

const buildConfig = (endsAt: number): MaintenanceConfig => ({
  enabled: true,
  endsAt,
  title: DEFAULT_MAINTENANCE_TITLE,
  message: DEFAULT_MAINTENANCE_MESSAGE,
});

const buildIdleConfig = (): MaintenanceConfig => ({
  enabled: false,
  endsAt: 0,
  title: DEFAULT_MAINTENANCE_TITLE,
  message: DEFAULT_MAINTENANCE_MESSAGE,
});

/**
 * Mağaza varsayılan olarak yayındadır. Bakım modu yalnızca yönetim panelinden
 * bilinçli olarak açıldığında devreye girer.
 */
const RESET_FLAG_KEY = "eticaretv8_maintenance_reset_v1";

const releaseStoredMaintenance = (): void => {
  const alreadyReset = readJson<boolean>(RESET_FLAG_KEY, false);
  if (alreadyReset) return;
  writeJson(RESET_FLAG_KEY, true);
  const stored = readJson<Partial<MaintenanceConfig> | null>(MAINTENANCE_KEY, null);
  if (stored && typeof stored.endsAt === "number") {
    writeJson(MAINTENANCE_KEY, { ...stored, enabled: false, endsAt: Date.now() });
  }
};

export const loadMaintenanceConfig = (): MaintenanceConfig => {
  releaseStoredMaintenance();
  const stored = readJson<Partial<MaintenanceConfig> | null>(MAINTENANCE_KEY, null);
  if (!stored || typeof stored.endsAt !== "number") {
    const fresh = buildIdleConfig();
    writeJson(MAINTENANCE_KEY, fresh);
    return fresh;
  }
  return {
    enabled: stored.enabled === true && stored.endsAt > Date.now(),
    endsAt: stored.endsAt,
    title: stored.title || DEFAULT_MAINTENANCE_TITLE,
    message: stored.message || DEFAULT_MAINTENANCE_MESSAGE,
  };
};

export const saveMaintenanceConfig = (config: MaintenanceConfig): void => {
  writeJson(MAINTENANCE_KEY, config);
  try {
    window.dispatchEvent(new CustomEvent(MAINTENANCE_EVENT, { detail: config }));
  } catch {
    /* event dispatch may be unavailable */
  }
};

export const startMaintenance = (seconds: number): MaintenanceConfig => {
  const config = buildConfig(Date.now() + Math.max(1, Math.round(seconds)) * 1000);
  saveMaintenanceConfig(config);
  return config;
};

export const stopMaintenance = (): MaintenanceConfig => {
  const current = loadMaintenanceConfig();
  const next: MaintenanceConfig = { ...current, enabled: false, endsAt: Date.now() };
  saveMaintenanceConfig(next);
  return next;
};

export interface RemainingTime {
  total: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const splitRemaining = (ms: number): RemainingTime => {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    total,
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
};

export const pad2 = (value: number): string => String(Math.max(0, value)).padStart(2, "0");

export const formatRemainingText = (ms: number): string => {
  const { hours, minutes, seconds } = splitRemaining(ms);
  return `${hours} saat ${minutes} dakika ${seconds} saniye`;
};

export const useMaintenanceConfig = (): MaintenanceConfig => {
  const [config, setConfig] = useState<MaintenanceConfig>(() => loadMaintenanceConfig());

  useEffect(() => {
    const sync = () => setConfig(loadMaintenanceConfig());
    window.addEventListener(MAINTENANCE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(MAINTENANCE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return config;
};

export const useCountdown = (endsAt: number): RemainingTime => {
  const [remaining, setRemaining] = useState<RemainingTime>(() => splitRemaining(endsAt - Date.now()));

  useEffect(() => {
    const tick = () => setRemaining(splitRemaining(endsAt - Date.now()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [endsAt]);

  return remaining;
};