import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be unavailable */
  }
}

export const PERSISTENT_EVENT = "readdy:persistent-updated";

export function usePersistentState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => readJson<T>(key, initial));

  useEffect(() => {
    writeJson(key, value);
    try {
      window.dispatchEvent(new CustomEvent(PERSISTENT_EVENT, { detail: { key } }));
    } catch {
      /* event dispatch may be unavailable */
    }
  }, [key, value]);

  return [value, setValue];
}