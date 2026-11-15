import { useEffect, useState } from "react";
import { readJson, writeJson } from "@/lib/persistent";

export const COOKIE_STORAGE_KEY = "cerez-onayi-v1";
export const COOKIE_EVENT = "cerez-onayi-guncellendi";

export type CookiePrefs = {
  decided: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export const defaultCookiePrefs: CookiePrefs = {
  decided: false,
  analytics: false,
  marketing: false,
  updatedAt: "",
};

export function readCookiePrefs(): CookiePrefs {
  return readJson<CookiePrefs>(COOKIE_STORAGE_KEY, defaultCookiePrefs);
}

export function saveCookiePrefs(next: {
  analytics: boolean;
  marketing: boolean;
  decided?: boolean;
}): CookiePrefs {
  const value: CookiePrefs = {
    decided: next.decided ?? true,
    analytics: next.analytics,
    marketing: next.marketing,
    updatedAt: new Date().toISOString(),
  };
  writeJson(COOKIE_STORAGE_KEY, value);
  try {
    window.dispatchEvent(new CustomEvent<CookiePrefs>(COOKIE_EVENT, { detail: value }));
  } catch {
    /* event dispatch may be unavailable */
  }
  return value;
}

export function useCookiePrefs(): [CookiePrefs, (next: { analytics: boolean; marketing: boolean }) => void] {
  const [prefs, setPrefs] = useState<CookiePrefs>(() => readCookiePrefs());

  useEffect(() => {
    const handle = (event: Event) => {
      const detail = (event as CustomEvent<CookiePrefs>).detail;
      setPrefs(detail ?? readCookiePrefs());
    };
    window.addEventListener(COOKIE_EVENT, handle);
    return () => window.removeEventListener(COOKIE_EVENT, handle);
  }, []);

  const update = (next: { analytics: boolean; marketing: boolean }) => {
    setPrefs(saveCookiePrefs(next));
  };

  return [prefs, update];
}

export function formatCookieDate(value: string): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}