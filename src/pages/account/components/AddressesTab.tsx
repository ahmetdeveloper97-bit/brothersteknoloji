import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/base/Modal";
import { AccountButton, AccountCard, AccountField, InlineAlert, accountInput, accountTextarea } from "@/components/base/AccountUI";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { TR_CITIES } from "@/lib/trCities";
import type { AddressRow } from "@/types/account";

interface AddressDraft {
  id?: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  addressLine: string;
  postalCode: string;
  isDefault: boolean;
}

const emptyDraft: AddressDraft = {
  title: "Ev",
  fullName: "",
  phone: "",
  city: "",
  district: "",
  addressLine: "",
  postalCode: "",
  isDefault: false,
};

export default function AddressesTab() {
  const { user } = useAuth();
  const [rows, setRows] = useState<AddressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<AddressDraft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setListError("");
    try {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRows((data ?? []) as AddressRow[]);
    } catch {
      setListError("Adresler yüklenemedi. Bağlantınızı kontrol edip tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const openNew = () => {
    setDraft({ ...emptyDraft, fullName: "", isDefault: rows.length === 0 });
    setFormError("");
    setOpen(true);
  };

  const openEdit = (row: AddressRow) => {
    setDraft({
      id: row.id,
      title: row.title,
      fullName: row.full_name ?? "",
      phone: row.phone ?? "",
      city: row.city ?? "",
      district: row.district ?? "",
      addressLine: row.address_line ?? "",
      postalCode: row.postal_code ?? "",
      isDefault: row.is_default,
    });
    setFormError("");
    setOpen(true);
  };

  const save = async () => {
    if (!user) return;
    if (!draft.title.trim() || !draft.fullName.trim() || !draft.addressLine.trim() || !draft.city.trim()) {
      setFormError("Adres başlığı, alıcı adı, şehir ve açık adres alanları zorunludur.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      if (draft.isDefault) {
        await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
      }
      const payload = {
        user_id: user.id,
        title: draft.title.trim(),
        full_name: draft.fullName.trim(),
        phone: draft.phone.trim() || null,
        city: draft.city.trim(),
        district: draft.district.trim() || null,
        address_line: draft.addressLine.trim(),
        postal_code: draft.postalCode.trim() || null,
        is_default: draft.isDefault,
      };

      const { error } = draft.id
        ? await supabase.from("addresses").update(payload).eq("id", draft.id).eq("user_id", user.id)
        : await supabase.from("addresses").insert(payload);

      if (error) throw error;
      setOpen(false);
      await load();
    } catch {
      setFormError("Adres kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: AddressRow) => {
    if (!user) return;
    setBusyId(row.id);
    try {
      await supabase.from("addresses").delete().eq("id", row.id).eq("user_id", user.id);
      await load();
    } finally {
      setBusyId("");
    }
  };

  const makeDefault = async (row: AddressRow) => {
    if (!user) return;
    setBusyId(row.id);
    try {
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
      await supabase.from("addresses").update({ is_default: true }).eq("id", row.id).eq("user_id", user.id);
      await load();
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="space-y-4">
      <AccountCard
        title="Adres & İletişim Bilgileri"
        subtitle="Teslimat adreslerinizi buradan yönetin. Varsayılan adres ödeme adımında otomatik seçilir."
        icon="ri-map-pin-2-line"
        action={
          <AccountButton onClick={openNew} icon="ri-add-line">
            Yeni Adres
          </AccountButton>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-foreground-500">
            <i className="ri-loader-4-line mr-2 animate-spin text-lg" />
            Adresler yükleniyor...
          </div>
        ) : listError ? (
          <div className="space-y-3">
            <InlineAlert tone="error">{listError}</InlineAlert>
            <AccountButton onClick={() => void load()} variant="ghost" icon="ri-refresh-line">
              Tekrar Dene
            </AccountButton>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-background-300 bg-background-100/60 px-6 py-12 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-background-200 text-foreground-600">
              <i className="ri-map-pin-add-line text-2xl" />
            </span>
            <h3 className="mt-3 font-heading text-sm font-bold text-foreground-950">Kayıtlı adresiniz yok</h3>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-foreground-500">
              Teslimat sürelerini kısaltmak için bir adres ekleyin, sonraki alışverişlerinizde tek tıkla kullanın.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {rows.map((row) => (
              <div
                key={row.id}
                className={`rounded-xl border p-4 transition-colors ${
                  row.is_default ? "border-primary-300 bg-primary-50/40" : "border-background-200 bg-background-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-foreground-950">
                      <i className="ri-bookmark-3-line text-primary-700" />
                      {row.title}
                    </p>
                    <p className="mt-1 text-xs font-medium text-foreground-800">{row.full_name}</p>
                  </div>
                  {row.is_default && (
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-bold text-accent-800">
                      Varsayılan
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-foreground-600">
                  {row.address_line}
                  <br />
                  {[row.district, row.city].filter(Boolean).join(" / ")}
                  {row.postal_code ? ` · ${row.postal_code}` : ""}
                </p>
                {row.phone && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-foreground-500">
                    <i className="ri-phone-line" />
                    {row.phone}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-background-200 pt-3">
                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-primary-700 hover:bg-primary-50"
                  >
                    <i className="ri-edit-line" /> Düzenle
                  </button>
                  {!row.is_default && (
                    <button
                      type="button"
                      onClick={() => void makeDefault(row)}
                      disabled={busyId === row.id}
                      className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-foreground-700 hover:bg-background-100 disabled:opacity-50"
                    >
                      <i className="ri-checkbox-circle-line" /> Varsayılan yap
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void remove(row)}
                    disabled={busyId === row.id}
                    className="ml-auto flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-primary-800 hover:bg-primary-50 disabled:opacity-50"
                  >
                    <i className="ri-delete-bin-6-line" /> Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AccountCard>

      <Modal
        open={open}
        title={draft.id ? "Adresi Düzenle" : "Yeni Adres Ekle"}
        subtitle="Teslimat için kullanılacak adres bilgileri"
        icon="ri-map-pin-2-line"
        onClose={() => setOpen(false)}
        footer={
          <div className="flex items-center justify-end gap-2">
            <AccountButton variant="ghost" onClick={() => setOpen(false)}>
              Vazgeç
            </AccountButton>
            <AccountButton onClick={save} loading={saving} icon="ri-save-3-line">
              Kaydet
            </AccountButton>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AccountField label="Adres başlığı" htmlFor="addr-title">
            <input
              id="addr-title"
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              maxLength={30}
              placeholder="Ev, İş, Yazlık"
              className={accountInput}
            />
          </AccountField>
          <AccountField label="Alıcı adı soyadı" htmlFor="addr-name">
            <input
              id="addr-name"
              value={draft.fullName}
              onChange={(event) => setDraft({ ...draft, fullName: event.target.value })}
              maxLength={80}
              placeholder="Ad Soyad"
              className={accountInput}
            />
          </AccountField>
          <AccountField label="Telefon" htmlFor="addr-phone">
            <input
              id="addr-phone"
              value={draft.phone}
              onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
              maxLength={20}
              placeholder="05xx xxx xx xx"
              className={accountInput}
            />
          </AccountField>
          <AccountField label="Posta kodu" htmlFor="addr-postal">
            <input
              id="addr-postal"
              value={draft.postalCode}
              onChange={(event) => setDraft({ ...draft, postalCode: event.target.value })}
              maxLength={10}
              placeholder="34000"
              className={accountInput}
            />
          </AccountField>
          <AccountField label="İl" htmlFor="addr-city">
            <input
              id="addr-city"
              value={draft.city}
              onChange={(event) => setDraft({ ...draft, city: event.target.value })}
              maxLength={40}
              placeholder="İstanbul"
              list="address-city-options"
              className={accountInput}
            />
            <datalist id="address-city-options">
              {TR_CITIES.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </AccountField>
          <AccountField label="İlçe" htmlFor="addr-district">
            <input
              id="addr-district"
              value={draft.district}
              onChange={(event) => setDraft({ ...draft, district: event.target.value })}
              maxLength={40}
              placeholder="Kadıköy"
              className={accountInput}
            />
          </AccountField>
        </div>
        <div className="mt-3">
          <AccountField label="Açık adres" htmlFor="addr-line">
            <textarea
              id="addr-line"
              value={draft.addressLine}
              onChange={(event) => setDraft({ ...draft, addressLine: event.target.value })}
              rows={3}
              maxLength={300}
              placeholder="Mahalle, sokak, bina ve daire bilgisi"
              className={accountTextarea}
            />
          </AccountField>
        </div>
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-foreground-700">
          <input
            type="checkbox"
            checked={draft.isDefault}
            onChange={(event) => setDraft({ ...draft, isDefault: event.target.checked })}
            className="h-4 w-4 cursor-pointer accent-primary-700"
          />
          Bu adresi varsayılan teslimat adresim yap
        </label>
        {formError && (
          <div className="mt-3">
            <InlineAlert tone="error">{formError}</InlineAlert>
          </div>
        )}
      </Modal>
    </div>
  );
}