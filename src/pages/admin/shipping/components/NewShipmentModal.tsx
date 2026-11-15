import { useMemo, useState } from "react";
import Modal from "@/components/base/Modal";
import { Field, Toggle, inputClass, textareaClass } from "@/components/base/AdminUI";
import { orderTotal, useAdminOrders } from "@/hooks/useAdminOrders";
import { formatPrice } from "@/lib/format";
import { calculateCargoPrice, cityZone, generateTracking } from "@/lib/shipping";
import { TR_CITIES } from "@/lib/trCities";
import type { CargoCompany, CargoTariff, Shipment, ShippingSettings } from "@/types/shipping";

interface NewShipmentModalProps {
  open: boolean;
  companies: CargoCompany[];
  tariffs: CargoTariff[];
  settings: ShippingSettings;
  onClose: () => void;
  onCreate: (shipment: Shipment) => void;
}

const formatNow = (date: Date): string =>
  `${date.toLocaleDateString("tr-TR")} ${date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`;

export default function NewShipmentModal({
  open,
  companies,
  tariffs,
  settings,
  onClose,
  onCreate,
}: NewShipmentModalProps) {
  const { orders } = useAdminOrders();
  const enabledCompanies = companies.filter((company) => company.enabled);
  const [orderId, setOrderId] = useState("");
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [companyId, setCompanyId] = useState(settings.defaultCompanyId);
  const [desi, setDesi] = useState(String(settings.defaultDesi));
  const [packages, setPackages] = useState("1");
  const [payment, setPayment] = useState<"paid" | "cod">("paid");
  const [codAmount, setCodAmount] = useState("");
  const [insurance, setInsurance] = useState(settings.insuranceEnabled);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const activeCompany = enabledCompanies.find((company) => company.id === companyId) ?? enabledCompanies[0];
  const zone = useMemo(() => cityZone(settings, city || "İstanbul"), [settings, city]);
  const tariff = tariffs.find((item) => item.companyId === activeCompany?.id);
  const desiValue = Math.max(0.1, Number(desi) || settings.defaultDesi);
  const estimatedCost = calculateCargoPrice(tariff, desiValue, {
    zoneMultiplier: zone.multiplier,
    cod: payment === "cod",
    insurance,
  });

  const reset = () => {
    setOrderId("");
    setCustomer("");
    setPhone("");
    setCity("");
    setAddress("");
    setCompanyId(settings.defaultCompanyId);
    setDesi(String(settings.defaultDesi));
    setPackages("1");
    setPayment("paid");
    setCodAmount("");
    setInsurance(settings.insuranceEnabled);
    setNote("");
    setError("");
  };

  const selectOrder = (id: string) => {
    setOrderId(id);
    const order = orders.find((item) => item.id === id);
    if (!order) return;
    setCustomer(order.customer);
    setPhone(order.phone);
    setCity(order.city);
    setAddress(order.address);
    setNote(order.note);
    if (order.payment.toLowerCase().includes("kapıda")) {
      setPayment("cod");
      setCodAmount(String(orderTotal(order)));
    } else {
      setPayment("paid");
      setCodAmount("");
    }
  };

  const submit = () => {
    if (!customer.trim() || !phone.trim() || !city.trim()) {
      setError("Müşteri adı, telefon ve şehir alanları zorunludur.");
      return;
    }
    if (payment === "cod" && Number(codAmount) <= 0) {
      setError("Kapıda ödeme için tahsil edilecek tutarı girin.");
      return;
    }
    const now = new Date();
    const eta = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const shipment: Shipment = {
      id: `SHP-${String(now.getTime()).slice(-5)}`,
      orderId: orderId || "Manuel Gönderi",
      customer: customer.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim() || "Adres belirtilmedi",
      companyId: activeCompany?.id ?? "yurtici",
      tracking: generateTracking(activeCompany),
      status: "label",
      desi: Math.round(desiValue * 10) / 10,
      packages: Math.max(1, Number(packages) || 1),
      cost: estimatedCost,
      codAmount: payment === "cod" ? Number(codAmount) || 0 : 0,
      date: formatNow(now),
      eta: eta.toLocaleDateString("tr-TR"),
      note: note.trim(),
      history: [
        {
          status: "label",
          date: formatNow(now),
          location: "Brothers Teknoloji Lojistik",
          note: `${activeCompany?.name ?? "Kargo"} için etiket oluşturuldu.`,
        },
      ],
    };
    onCreate(shipment);
    reset();
  };

  return (
    <Modal
      open={open}
      title="Yeni Kargo Gönderisi"
      subtitle="Siparişten veya manuel olarak etiket oluşturun"
      icon="ri-add-box-line"
      onClose={onClose}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-foreground-600">
            Tahmini kargo bedeli: <span className="font-semibold text-foreground-950">{formatPrice(estimatedCost)}</span>
            <span className="ml-1 text-[11px] text-foreground-400">({zone.name})</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium text-foreground-700 hover:bg-background-100"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={submit}
              className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700"
            >
              <i className="ri-price-tag-3-line" />
              Etiket Oluştur
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-3.5">
        {error && (
          <p className="flex items-center gap-2 rounded-lg border border-foreground-300 bg-foreground-100 px-3 py-2 text-xs text-foreground-900">
            <i className="ri-error-warning-line" />
            {error}
          </p>
        )}

        <Field label="Siparişten oluştur (opsiyonel)" hint="Seçtiğinizde müşteri ve teslimat bilgileri otomatik dolar.">
          <select value={orderId} onChange={(event) => selectOrder(event.target.value)} className={inputClass}>
            <option value="">Manuel gönderi</option>
            {orders
              .filter((order) => order.status !== "İptal")
              .map((order) => (
                <option key={order.id} value={order.id}>
                  {order.id} · {order.customer} · {order.city}
                </option>
              ))}
          </select>
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Müşteri adı *">
            <input value={customer} onChange={(event) => setCustomer(event.target.value)} className={inputClass} />
          </Field>
          <Field label="Telefon *">
            <input value={phone} onChange={(event) => setPhone(event.target.value)} className={inputClass} />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Şehir / İlçe *">
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="İstanbul / Kadıköy"
              list="shipment-city-options"
              className={inputClass}
            />
            <datalist id="shipment-city-options">
              {TR_CITIES.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </Field>
          <Field label="Kargo firması">
            <select value={activeCompany?.id ?? ""} onChange={(event) => setCompanyId(event.target.value)} className={inputClass}>
              {enabledCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name} · {company.avgDelivery}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Açık adres">
          <textarea
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            rows={2}
            maxLength={200}
            className={textareaClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Desi">
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={desi}
              onChange={(event) => setDesi(event.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Paket sayısı">
            <input
              type="number"
              min="1"
              value={packages}
              onChange={(event) => setPackages(event.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Ödeme">
            <select
              value={payment}
              onChange={(event) => setPayment(event.target.value as "paid" | "cod")}
              className={inputClass}
            >
              <option value="paid">Ödeme alındı</option>
              <option value="cod">Kapıda ödeme</option>
            </select>
          </Field>
          <Field label="Kapıda ödeme tutarı">
            <input
              type="number"
              min="0"
              value={codAmount}
              onChange={(event) => setCodAmount(event.target.value)}
              disabled={payment !== "cod"}
              className={`${inputClass} disabled:opacity-50`}
            />
          </Field>
        </div>

        <div className="rounded-lg bg-background-100 p-3">
          <Toggle
            checked={insurance}
            onChange={setInsurance}
            label="Gönderi sigortası"
            description="Elektronik ürünlerde kayıp/hasar durumunda bedel güvence altına alınır."
          />
        </div>

        <Field label="Kurye notu">
          <input value={note} onChange={(event) => setNote(event.target.value)} className={inputClass} />
        </Field>
      </div>
    </Modal>
  );
}