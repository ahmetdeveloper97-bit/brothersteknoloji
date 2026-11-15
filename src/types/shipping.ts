export type CargoStatus =
  | "label"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "returned";

export interface CargoCompany {
  id: string;
  name: string;
  short: string;
  enabled: boolean;
  connected: boolean;
  trackingUrl: string;
  phone: string;
  avgDelivery: string;
  supportsCod: boolean;
  supportsReturn: boolean;
  customerCode: string;
  apiKey: string;
  note: string;
}

export interface CargoTariff {
  companyId: string;
  basePrice: number;
  perDesi: number;
  codFee: number;
  returnFee: number;
}

export interface CargoMovement {
  status: CargoStatus;
  date: string;
  location: string;
  note: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  customer: string;
  phone: string;
  city: string;
  address: string;
  companyId: string;
  tracking: string;
  status: CargoStatus;
  desi: number;
  packages: number;
  cost: number;
  codAmount: number;
  date: string;
  eta: string;
  note: string;
  history: CargoMovement[];
}

export interface CargoZone {
  id: string;
  name: string;
  multiplier: number;
  cities: string[];
}

export interface ShippingSettings {
  defaultCompanyId: string;
  freeShippingEnabled: boolean;
  freeShippingThreshold: number;
  defaultDesi: number;
  cutoff: string;
  insuranceEnabled: boolean;
  autoLabel: boolean;
  notifySms: boolean;
  notifyWhatsApp: boolean;
  pickupAddress: string;
  returnAddress: string;
  zones: CargoZone[];
}