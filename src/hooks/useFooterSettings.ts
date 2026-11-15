import { useEffect, useState } from "react";
import { fetchFooterSettings, getFooterSettings, subscribeFooterSettings } from "@/lib/siteSettings";
import type { FooterSettings } from "@/types/admin";

export function useFooterSettings(): FooterSettings {
  const [settings, setSettings] = useState<FooterSettings>(() => getFooterSettings());

  useEffect(() => {
    let active = true;
    const sync = () => setSettings(getFooterSettings());

    const unsubscribe = subscribeFooterSettings(sync);
    sync();

    void fetchFooterSettings().then((next) => {
      if (active) setSettings(next);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return settings;
}