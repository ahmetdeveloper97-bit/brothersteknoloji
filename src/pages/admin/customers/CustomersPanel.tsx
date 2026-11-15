import { useMemo, useState } from "react";
import Modal from "@/components/base/Modal";
import { Banner, Panel, Pill } from "@/components/base/AdminUI";
import { usePersistentState } from "@/lib/persistent";
import { ADMIN_STORE_KEYS, formatNumberTr, loadCustomers, segmentTone } from "@/lib/adminStore";
import type { AdminCustomer, CustomerSegment } from "@/types/admin";
import CustomerDetailModal from "@/pages/admin/customers/CustomerDetailModal";

type SortKey = "spend" | "orders" | "name" | "recent";

const segmentFilters: Array<CustomerSegment | "all"> = ["all", "VIP", "Sadık", "Yeni", "Riskli", "Pasif"];

const initialsOf = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("tr"))
    .join("");

const emptyCustomer: AdminCustomer = {
  id: "",
  name: "",
  email: "",
  phone: "",
  city: "",
  registeredAt: new Date().toISOString().slice(0, 10),
  lastOrder: null,
  orderCount: 0,
  totalSpend: 0,
  segment: "Yeni",
  emailOptIn: true,
  smsOptIn: true,
  note: "",
  tags: [],
};

export default function CustomersPanel() {
  const [customers, setCustomers] = usePersistentState<AdminCustomer[]>(
    ADMIN_STORE_KEYS.customers,
    loadCustomers()
  );
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState<CustomerSegment | "all">("all");
  const [sort, setSort] = useState<SortKey>("spend");
  const [formState, setFormState] = useState<{ draft: AdminCustomer; isNew: boolean } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCustomer | null>(null);

  const stats = useMemo(() => {
    const total = customers.length;
    const vip = customers.filter((customer) => customer.segment === "VIP").length;
    const orders = customers.reduce((sum, customer) => sum + customer.orderCount, 0);
    const revenue = customers.reduce((sum, customer) => sum + customer.totalSpend, 0);
    const optIn = customers.filter((customer) => customer.emailOptIn).length;
    return {
      total,
      vip,
      avgBasket: orders ? revenue / orders : 0,
      revenue,
      optIn,
    };
  }, [customers]);

  const segmentCounts = useMemo(() => {
    const map: Record<string, number> = { all: customers.length };
    customers.forEach((customer) => {
      map[customer.segment] = (map[customer.segment] ?? 0) + 1;
    });
    return map;
  }, [customers]);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("tr");
    const list = customers.filter((customer) => {
      if (segment !== "all" && customer.segment !== segment) return false;
      if (!term) return true;
      return `${customer.name} ${customer.email} ${customer.phone} ${customer.city}`
        .toLocaleLowerCase("tr")
        .includes(term);
    });
    return [...list].sort((a, b) => {
      if (sort === "spend") return b.totalSpend - a.totalSpend;
      if (sort === "orders") return b.orderCount - a.orderCount;
      if (sort === "name") return a.name.localeCompare(b.name, "tr");
      return (b.lastOrder ?? "").localeCompare(a.lastOrder ?? "");
    });
  }, [customers, search, segment, sort]);

  const saveCustomer = (customer: AdminCustomer, isNew: boolean) => {
    if (isNew) {
      setCustomers((current) => [
        { ...customer, id: `c-${Date.now().toString().slice(-6)}` },
        ...current,
      ]);
    } else {
      setCustomers((current) => current.map((item) => (item.id === customer.id ? customer : item)));
    }
    setFormState(null);
  };

  const removeCustomer = () => {
    if (!deleteTarget) return;
    setCustomers((current) => current.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">Toplam Müşteri</p>
          <p className="mt-1 font-heading text-xl font-bold text-foreground-950">{formatNumberTr(stats.total)}</p>
          <p className="mt-0.5 text-[11px] text-foreground-500">{stats.optIn} e-posta izinli</p>
        </div>
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">VIP Müşteri</p>
          <p className="mt-1 font-heading text-xl font-bold text-secondary-800">{stats.vip}</p>
          <p className="mt-0.5 text-[11px] text-foreground-500">Yüksek harcama segmenti</p>
        </div>
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">Ortalama Sepet</p>
          <p className="mt-1 font-heading text-xl font-bold text-foreground-950">
            {formatNumberTr(stats.avgBasket)} ₺
          </p>
          <p className="mt-0.5 text-[11px] text-foreground-500">Sipariş başına ortalama</p>
        </div>
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">Toplam Harcama</p>
          <p className="mt-1 font-heading text-xl font-bold text-accent-700">{formatNumberTr(stats.revenue)} ₺</p>
          <p className="mt-0.5 text-[11px] text-foreground-500">Tüm müşteriler</p>
        </div>
      </div>

      <Banner tone="info">
        Segmentler müşteri harcaması ve sipariş geçmişine göre belirlenir. SMS izni olmayan müşterilere NetGSM
        kampanyası gönderilmez.
      </Banner>

      <Panel
        title="Müşteri Listesi"
        subtitle={`${filtered.length} müşteri gösteriliyor`}
        icon="ri-team-line"
        padded={false}
        action={
          <button
            type="button"
            onClick={() => setFormState({ draft: { ...emptyCustomer, tags: [] }, isNew: true })}
            className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-xs font-semibold text-background-50 hover:bg-primary-700"
          >
            <i className="ri-user-add-line" />
            Müşteri Ekle
          </button>
        }
      >
        <div className="space-y-2.5 border-b border-background-200 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="İsim, e-posta, telefon veya şehir ara..."
                className="h-9 w-full rounded-lg border border-background-300 bg-background-50 pl-8 pr-3 text-sm text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500"
              />
            </div>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="h-9 cursor-pointer rounded-lg border border-background-300 bg-background-50 px-2 text-xs text-foreground-700 outline-none focus:border-primary-500"
            >
              <option value="spend">Harcamaya göre</option>
              <option value="orders">Sipariş sayısına göre</option>
              <option value="recent">Son siparişe göre</option>
              <option value="name">İsme göre</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-1">
            {segmentFilters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSegment(item)}
                className={`h-8 cursor-pointer whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors ${
                  segment === item
                    ? "bg-primary-800 text-background-50"
                    : "bg-background-100 text-foreground-600 hover:bg-background-200"
                }`}
              >
                {item === "all" ? "Tümü" : item}
                <span className="ml-1 opacity-70">{segmentCounts[item] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-background-200 text-[11px] uppercase tracking-wide text-foreground-500">
                <th className="px-4 py-2.5 font-medium">Müşteri</th>
                <th className="px-3 py-2.5 font-medium">Telefon</th>
                <th className="px-3 py-2.5 font-medium">Şehir</th>
                <th className="px-3 py-2.5 font-medium">Sipariş</th>
                <th className="px-3 py-2.5 font-medium">Harcama</th>
                <th className="px-3 py-2.5 font-medium">Segment</th>
                <th className="px-3 py-2.5 font-medium">Son Sipariş</th>
                <th className="px-4 py-2.5 text-right font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr
                  key={customer.id}
                  className="cursor-pointer border-b border-background-100 last:border-0 hover:bg-background-100/60"
                  onClick={() => setFormState({ draft: { ...customer, tags: [...customer.tags] }, isNew: false })}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[11px] font-bold text-primary-900">
                        {initialsOf(customer.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground-950">{customer.name}</p>
                        <p className="truncate text-[11px] text-foreground-500">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-foreground-600">{customer.phone || "—"}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-foreground-600">{customer.city || "—"}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-foreground-700">{customer.orderCount}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-foreground-900">
                    {formatNumberTr(customer.totalSpend)} ₺
                  </td>
                  <td className="px-3 py-2.5">
                    <Pill tone={segmentTone(customer.segment)}>{customer.segment}</Pill>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-xs text-foreground-600">
                    {customer.lastOrder ?? "Sipariş yok"}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setFormState({ draft: { ...customer, tags: [...customer.tags] }, isNew: false });
                        }}
                        aria-label="Müşteriyi düzenle"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-foreground-500 hover:bg-background-200 hover:text-primary-800"
                      >
                        <i className="ri-edit-line" />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setDeleteTarget(customer);
                        }}
                        aria-label="Müşteriyi sil"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-foreground-500 hover:bg-background-200 hover:text-accent-700"
                      >
                        <i className="ri-delete-bin-6-line" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!filtered.length && (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <i className="ri-user-search-line text-2xl text-foreground-400" />
            <p className="text-sm text-foreground-600">Bu filtreye uygun müşteri bulunamadı.</p>
          </div>
        )}
      </Panel>

      {formState && (
        <CustomerDetailModal
          open
          draft={formState.draft}
          isNew={formState.isNew}
          onClose={() => setFormState(null)}
          onSave={saveCustomer}
        />
      )}

      <Modal
        open={Boolean(deleteTarget)}
        title="Müşteriyi sil"
        subtitle={deleteTarget?.email}
        icon="ri-user-unfollow-line"
        onClose={() => setDeleteTarget(null)}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="h-9 cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium text-foreground-700 hover:bg-background-100"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={removeCustomer}
              className="h-9 cursor-pointer whitespace-nowrap rounded-lg bg-accent-700 px-4 text-xs font-semibold text-background-50 hover:bg-accent-600"
            >
              Müşteriyi Sil
            </button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-foreground-700">
          <strong className="text-foreground-950">{deleteTarget?.name}</strong> kaydı silinecek. Geçmiş siparişler
          silinmez, sipariş listesinde görünmeye devam eder.
        </p>
      </Modal>
    </div>
  );
}