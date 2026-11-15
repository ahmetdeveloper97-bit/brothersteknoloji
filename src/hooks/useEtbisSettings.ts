import { useEffect, useState } from "react";
import { ETBIS_EVENT, loadEtbisSettings } from "@/lib/adminStore";
import type { EtbisSettings } from "@/types/admin";

export function useEtbisSettings(): EtbisSettings {
  const [settings, setSettings] = useState<EtbisSettings>(() => loadEtbisSettings());

  useEffect(() => {
    const sync = () => setSettings(loadEtbisSettings());
    window.addEventListener(ETBIS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ETBIS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return settings;
}