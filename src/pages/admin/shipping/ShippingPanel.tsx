import { useState } from "react";
import { Tabs } from "@/components/base/AdminUI";
import { usePersistentState } from "@/lib/persistent";
import {
  SHIPPING_KEYS,
  loadCargoCompanies,
  loadCargoTariffs,
  loadShipments,
  loadShippingSettings,
} from "@/lib/shipping";
import ShipmentsTab from "@/pages/admin/shipping/ShipmentsTab";
import CompaniesTab from "@/pages/admin/shipping/CompaniesTab";
import RatesTab from "@/pages/admin/shipping/RatesTab";
import ReportsTab from "@/pages/admin/shipping/ReportsTab";
import ShippingSettingsTab from "@/pages/admin/shipping/ShippingSettingsTab";
import type { CargoCompany, CargoTariff, Shipment, ShippingSettings } from "@/types/shipping";

type TabId = "shipments" | "companies" | "rates" | "reports" | "settings";

export default function ShippingPanel() {
  const [tab, setTab] = useState<TabId>("shipments");
  const [companies, setCompanies] = usePersistentState<CargoCompany[]>(SHIPPING_KEYS.companies, loadCargoCompanies());
  const [tariffs, setTariffs] = usePersistentState<CargoTariff[]>(SHIPPING_KEYS.tariffs, loadCargoTariffs());
  const [shipments, setShipments] = usePersistentState<Shipment[]>(SHIPPING_KEYS.shipments, loadShipments());
  const [settings, setSettings] = usePersistentState<ShippingSettings>(SHIPPING_KEYS.settings, loadShippingSettings());

  const patchSettings = (patch: Partial<ShippingSettings>) => {
    setSettings((current) => ({ ...current, ...patch }));
  };

  const toggleCompany = (id: string) => {
    setCompanies((current) => current.map((company) => (company.id === id ? { ...company, enabled: !company.enabled } : company)));
  };

  const enableAll = () => {
    setCompanies((current) => current.map((company) => ({ ...company, enabled: true })));
  };

  const saveCompany = (company: CargoCompany, isNew: boolean) => {
    if (isNew) {
      setCompanies((current) => [...current, company]);
      setTariffs((current) => [
        ...current,
        { companyId: company.id, basePrice: 45, perDesi: 9, codFee: 12, returnFee: 30 },
      ]);
      return;
    }
    setCompanies((current) => current.map((item) => (item.id === company.id ? company : item)));
  };

  const pendingLabels = shipments.filter((shipment) => shipment.status === "label").length;

  return (
    <div className="space-y-4">
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "shipments", label: "Gönderiler", icon: "ri-truck-line", badge: pendingLabels },
          { id: "companies", label: "Kargo Firmaları", icon: "ri-building-4-line", badge: companies.length },
          { id: "rates", label: "Fiyat & Bölge", icon: "ri-money-dollar-circle-line" },
          { id: "reports", label: "Performans Raporu", icon: "ri-bar-chart-box-line" },
          { id: "settings", label: "Ayarlar", icon: "ri-settings-3-line" },
        ]}
      />

      {tab === "shipments" && (
        <ShipmentsTab
          shipments={shipments}
          companies={companies}
          tariffs={tariffs}
          settings={settings}
          onShipments={setShipments}
        />
      )}

      {tab === "companies" && (
        <CompaniesTab companies={companies} onToggle={toggleCompany} onSave={saveCompany} onEnableAll={enableAll} />
      )}

      {tab === "rates" && (
        <RatesTab
          companies={companies}
          tariffs={tariffs}
          settings={settings}
          onTariffs={setTariffs}
          onSettings={patchSettings}
        />
      )}

      {tab === "reports" && <ReportsTab shipments={shipments} companies={companies} />}

      {tab === "settings" && (
        <ShippingSettingsTab settings={settings} companies={companies} onSettings={patchSettings} />
      )}
    </div>
  );
}