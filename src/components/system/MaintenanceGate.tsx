import { useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import MaintenanceScreen from "@/components/system/MaintenanceScreen";
import { saveMaintenanceConfig, useMaintenanceConfig } from "@/lib/maintenance";

interface MaintenanceGateProps {
  children: ReactNode;
}

/** Yönetim paneli ve yönetici girişi bakım modundan etkilenmez. */
const BYPASS_PREFIXES = ["/arteadmin"];

export default function MaintenanceGate({ children }: MaintenanceGateProps) {
  const location = useLocation();
  const config = useMaintenanceConfig();
  const bypass = BYPASS_PREFIXES.some(
    (prefix) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`),
  );

  const expired = config.enabled && config.endsAt <= Date.now();

  useEffect(() => {
    if (!expired) return;
    const timer = window.setTimeout(() => {
      saveMaintenanceConfig({ ...config, enabled: false });
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [expired, config]);

  if (config.enabled && !bypass) {
    return <MaintenanceScreen />;
  }

  return <>{children}</>;
}