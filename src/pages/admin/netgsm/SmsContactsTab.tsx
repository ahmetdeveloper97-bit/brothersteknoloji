import { useMemo, useState } from "react";
import Modal from "@/components/base/Modal";
import { Banner, Field, Panel, Pill, inputClass } from "@/components/base/AdminUI";
import { smsGroups } from "@/lib/integrations";
import { isValidTrPhone, formatTrPhone } from "@/lib/whatsapp";
import type { SmsContact } from "@/types/integrations";

interface SmsContactsTabProps {
  contacts: SmsContact[];
  onContacts: (contacts: SmsContact[]) => void;
}

export default function SmsContactsTab({ contacts, onContacts }: SmsContactsTabProps) {
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("all");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [newGroup, setNewGroup] = useState(smsGroups[0]);
  const [error, setError] = useState("");

  const visible = useMemo(
    () =>
      contacts.filter((contact) => {
        const matchesGroup = group === "all" || contact.group === group;
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query || contact.name.toLowerCase().includes(query) || contact.phone.includes(query);
        return matchesGroup && matchesSearch;
      }),
    [contacts, group, search]
  );

  const addContact = () => {
    if (name.trim().length < 2) {
      setError("Ad soyad girin.");
      return;
    }
    if (!isValidTrPhone(phone)) {
      setError("Geçerli bir cep telefonu numarası girin.");
      return;
    }
    const contact: SmsContact = {
      id: `p${Date.now()}`,
      name: name.trim(),
      phone: formatTrPhone(phone),
      group: newGroup,
      optIn: true,
    };
    onContacts([contact, ...contacts]);
    setOpen(false);
    setName("");
    setPhone("");
    setError("");
  };

  const toggleOptIn = (id: string) => {
    onContacts(contacts.map((contact) => (contact.id === id ? { ...contact, optIn: !contact.optIn } : contact)));
  };

  const remove = (id: string) => {
    onContacts(contacts.filter((contact) => contact.id !== id));
  };

  return (
    <Panel
      title="Kişi Listesi"
      subtitle={`${contacts.length} kayıtlı kişi · ${contacts.filter((contact) => contact.optIn).length} İYS onaylı`}
      icon="ri-contacts-book-2-line"
      padded={false}
      action={
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <i className="ri-search-line pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-foreground-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Kişi ara..."
              className="h-9 w-40 rounded-lg border border-background-300 bg-background-50 pl-8 pr-2 text-xs text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500"
            />
          </div>
          <select
            value={group}
            onChange={(event) => setGroup(event.target.value)}
            className="h-9 cursor-pointer rounded-lg border border-background-300 bg-background-50 px-2 text-xs text-foreground-800 outline-none"
          >
            <option value="all">Tüm gruplar</option>
            {smsGroups.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-9 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-xs font-semibold text-background-50 hover:bg-primary-700"
          >
            <i className="ri-user-add-line" />
            Yeni Kişi
          </button>
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-background-200 text-[11px] uppercase tracking-wide text-foreground-500">
              <th className="px-4 py-2.5 font-semibold">Ad Soyad</th>
              <th className="px-3 py-2.5 font-semibold">Telefon</th>
              <th className="px-3 py-2.5 font-semibold">Grup</th>
              <th className="px-3 py-2.5 font-semibold">İYS Onayı</th>
              <th className="px-4 py-2.5 text-right font-semibold">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((contact) => (
              <tr key={contact.id} className="border-b border-background-100 last:border-0 hover:bg-background-100/60">
                <td className="px-4 py-3 font-medium text-foreground-950">{contact.name}</td>
                <td className="whitespace-nowrap px-3 py-3 text-xs text-foreground-600">{contact.phone}</td>
                <td className="px-3 py-3">
                  <Pill tone="neutral">{contact.group}</Pill>
                </td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => toggleOptIn(contact.id)}
                    className={`cursor-pointer rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      contact.optIn ? "bg-accent-100 text-accent-900" : "bg-background-200 text-foreground-700"
                    }`}
                  >
                    {contact.optIn ? "Onaylı" : "Onaysız"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => remove(contact.id)}
                    aria-label="Kişiyi sil"
                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-foreground-500 hover:bg-background-100 hover:text-foreground-900"
                  >
                    <i className="ri-delete-bin-6-line" />
                  </button>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-foreground-500">
                  Aramanızla eşleşen kişi yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setError("");
        }}
        title="Yeni Kişi Ekle"
        subtitle="NetGSM kişi listesine eklenir"
        icon="ri-user-add-line"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-9 cursor-pointer rounded-lg border border-background-300 px-3 text-sm text-foreground-700 hover:bg-background-100"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={addContact}
              className="h-9 cursor-pointer rounded-lg bg-primary-800 px-4 text-sm font-semibold text-background-50 hover:bg-primary-700"
            >
              Kaydet
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          {error && <Banner tone="danger">{error}</Banner>}
          <Field label="Ad Soyad">
            <input value={name} onChange={(event) => setName(event.target.value)} className={inputClass} />
          </Field>
          <Field label="Telefon">
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="05xx xxx xx xx"
              className={inputClass}
            />
          </Field>
          <Field label="Grup">
            <select value={newGroup} onChange={(event) => setNewGroup(event.target.value)} className={inputClass}>
              {smsGroups.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Modal>
    </Panel>
  );
}