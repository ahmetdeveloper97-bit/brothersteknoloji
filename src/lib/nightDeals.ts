import type { ShowcasePageSettings } from "@/types/showcasePage";

export const DEFAULT_NIGHT_START = "23:59";
export const DEFAULT_NIGHT_END = "06:00";

/** "23:59" biçimindeki saati gün içi dakikaya çevirir. Geçersizse null döner. */
export const parseClock = (value?: string): number | null => {
  if (!value) return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
};

/** Saati her zaman "SS:DD" biçiminde gösterir. */
export const clockLabel = (value?: string, fallback = "--:--"): string => {
  const minutes = parseClock(value);
  if (minutes === null) return fallback;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};

export interface NightWindowState {
  /** Saat kuralı uygulanıyor mu */
  enforced: boolean;
  /** Şu anda gece indirimi geçerli mi */
  open: boolean;
  startLabel: string;
  endLabel: string;
  /** Açılışa ya da kapanışa kalan süre (ms) */
  remainingMs: number;
}

/** Saat aralığını hesaplar. Gece yarısını aşan aralıklar (23:59 - 06:00) desteklenir. */
export const getNightWindow = (
  page: Pick<ShowcasePageSettings, "startTime" | "endTime" | "scheduleEnabled">,
  now: Date = new Date(),
): NightWindowState => {
  const startMinutes = parseClock(page.startTime) ?? parseClock(DEFAULT_NIGHT_START) ?? 1439;
  const endMinutes = parseClock(page.endTime) ?? parseClock(DEFAULT_NIGHT_END) ?? 360;
  const startLabel = clockLabel(page.startTime, DEFAULT_NIGHT_START);
  const endLabel = clockLabel(page.endTime, DEFAULT_NIGHT_END);
  const enforced = page.scheduleEnabled !== false;

  if (!enforced || startMinutes === endMinutes) {
    return { enforced, open: true, startLabel, endLabel, remainingMs: 0 };
  }

  const startSec = startMinutes * 60;
  const endSec = endMinutes * 60;
  const currentSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const daySec = 24 * 60 * 60;

  if (startSec > endSec) {
    // Gece yarısını aşan aralık
    if (currentSec >= startSec) {
      return { enforced, open: true, startLabel, endLabel, remainingMs: (endSec + daySec - currentSec) * 1000 };
    }
    if (currentSec < endSec) {
      return { enforced, open: true, startLabel, endLabel, remainingMs: (endSec - currentSec) * 1000 };
    }
    return { enforced, open: false, startLabel, endLabel, remainingMs: (startSec - currentSec) * 1000 };
  }

  if (currentSec >= startSec && currentSec < endSec) {
    return { enforced, open: true, startLabel, endLabel, remainingMs: (endSec - currentSec) * 1000 };
  }
  if (currentSec < startSec) {
    return { enforced, open: false, startLabel, endLabel, remainingMs: (startSec - currentSec) * 1000 };
  }
  return { enforced, open: false, startLabel, endLabel, remainingMs: (startSec + daySec - currentSec) * 1000 };
};

/** Geri sayımı "02:14:09" biçiminde yazar. */
export const formatCountdown = (ms: number): string => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
};