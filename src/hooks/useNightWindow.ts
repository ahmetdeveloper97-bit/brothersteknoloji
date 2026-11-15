import { useEffect, useState } from "react";
import { getNightWindow, type NightWindowState } from "@/lib/nightDeals";
import type { ShowcasePageSettings } from "@/types/showcasePage";

/** Saat penceresini saniye saniye takip eder; mağaza sayfası bu değere göre kilitlenir. */
export function useNightWindow(
  page: Pick<ShowcasePageSettings, "startTime" | "endTime" | "scheduleEnabled">,
): NightWindowState {
  const { startTime, endTime, scheduleEnabled } = page;
  const [state, setState] = useState<NightWindowState>(() =>
    getNightWindow({ startTime, endTime, scheduleEnabled }),
  );

  useEffect(() => {
    const tick = () => setState(getNightWindow({ startTime, endTime, scheduleEnabled }));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [startTime, endTime, scheduleEnabled]);

  return state;
}