import { useCallback, useEffect, useState } from "react";
import { AccountButton, AccountCard, AccountField, InlineAlert, accountInput, accountTextarea } from "@/components/base/AccountUI";
import { useAuth } from "@/context/AuthContext";
import { formatDateTime } from "@/lib/accountFormat";
import { supabase } from "@/lib/supabase";
import { TR_CITIES } from "@/lib/trCities";
import type { InvoiceType } from "@/types/account";

interface BillingDraft {
  invoiceType: InvoiceType;
  fullName: string;
  companyName: string;
  taxOffice: string;
  taxNumber: string;
  addressLine: string;
  city: string;
  district: string;
  phone: string;
  email: string;
}

export default function BillingTab() {
  const { user, profile } = useAuth();
  const [draft, setDraft] = useState<BillingDraft>({
    invoiceType: "individual",
    fullName: "",
    companyName: "",
    taxOffice: "",
    taxNumber: "",
    addressLine: "",
    city: "",
    district: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error: queryError } = await supabase
        .from("billing_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (queryError) throw queryError;
      if (data) {
        const row = data as Record<string, unknown>;
        setDraft({
          invoiceType: (row.invoice_type as InvoiceType) ?? "individual",
          fullName: (row.full_name as string) ?? "",
          companyName: (row.company_name as string) ?? "",
          taxOffice: (row.tax_office as string) ?? "",
          taxNumber: (row.tax_number as string) ?? "",
          addressLine: (row.address_line as string) ?? "",
          city: (row.city as string) ?? "",
          district: (row.district as string) ?? "",
          phone: (row.phone as string) ?? "",
          email: (row.email as string) ?? "",
        });
        setUpdatedAt((row.updated_at as string) ?? null);
      } else {
        setDraft((current) => ({
          ...current,
          fullName: profile?.full_name ?? "",
          phone: profile?.phone ?? "",
          email: profile?.email ?? user.email ?? "",
        }));
      }
    } catch {
      setError("Fatura bilgileri yüklenemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    if (!user) return;
    setError("");
    setMessage("");
    if (draft.invoiceType === "individual" && !draft.fullName.trim()) {
      setError("Bireysel fatura için ad soyad zorunludur.");
      return;
    }
    if (draft.invoiceType === "corporate" && (!draft.companyName.trim() || !draft.taxNumber.trim())) {
      setError("Kurumsal fatura için firma adı ve vergi numarası zorunludur.");
      return;
    }

    setSaving(true);
    try {
      const { error: upsertError } = await supabase.from("billing_profiles").upsert({
        user_id: user.id,
        invoice_type: draft.invoiceType,
        full_name: draft.fullName.trim() || null,
        company_name: draft.invoiceType === "corporate" ? draft.companyName.trim() : null,
        tax_office: draft.invoiceType === "corporate" ? draft.taxOffice.trim() || null : null,
        tax_number: draft.invoiceType === "corporate" ? draft.taxNumber.trim() : null,
        address_line: draft.addressLine.trim() || null,
        city: draft.city.trim() || null,
        district: draft.district.trim() || null,
        phone: draft.phone.trim() || null,
        email: draft.email.trim() || null,
        updated_at: new Date().toISOString(),
      });
      if (upsertError) throw upsertError;
      setUpdatedAt(new Date().toISOString());
      setMessage("Fatura bilgileriniz kaydedildi.");
    } catch {
      setError("Fatura bilgileri kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  const set = (changes: Partial<BillingDraft>) => {
    setDraft((current) => ({ ...current, ...changes }));
    setMessage("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-background-200 bg-background-50 py-16 text-sm text-foreground-500">
        <i className="ri-loader-4-line mr-2 animate-spin text-lg" />
        Fatura bilgileri yükleniyor...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AccountCard
        title="Fatura Bilgileri"
        subtitle="Ödeme adımında bu bilgiler otomatik doldurulur."
        icon="ri-receipt-line"
        action={updatedAt ? <span className="text-[11px] text-foreground-400">Son güncelleme: {formatDateTime(updatedAt)}</span> : undefined}
      >
        <div className="mb-5 grid grid-cols-2 gap-1 rounded-full bg-background-100 p-1 sm:max-w-sm">
          <button
            type="button"
            onClick={() => set({ invoiceType: "individual" })}
            className={`h-9 cursor-pointer whitespace-nowrap rounded-full text-xs font-semibold transition-colors ${
              draft.invoiceType === "individual"
                ? "bg-background-50 text-foreground-950 shadow-sm"
                : "text-foreground-600 hover:text-foreground-900"
            }`}
          >
            Bireysel
          </button>
          <button
            type="button"
            onClick={() => set({ invoiceType: "corporate" })}
            className={`h-9 cursor-pointer whitespace-nowrap rounded-full text-xs font-semibold transition-colors ${
              draft.invoiceType === "corporate"
                ? "bg-background-50 text-foreground-950 shadow-sm"
                : "text-foreground-600 hover:text-foreground-900"
            }`}
          >
            Kurumsal
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AccountField label="Ad Soyad" htmlFor="bill-name">
            <input
              id="bill-name"
              value={draft.fullName}
              onChange={(event) => set({ fullName: event.target.value })}
              maxLength={80}
              placeholder="Ad Soyad"
              className={accountInput}
            />
          </AccountField>

          {draft.invoiceType === "corporate" ? (
            <>
              <AccountField label="Firma adı" htmlFor="bill-company">
                <input
                  id="bill-company"
                  value={draft.companyName}
                  onChange={(event) => set({ companyName: event.target.value })}
                  maxLength={120}
                  placeholder="Firma Ünvanı A.Ş."
                  className={accountInput}
                />
              </AccountField>
              <AccountField label="Vergi dairesi" htmlFor="bill-tax-office">
                <input
                  id="bill-tax-office"
                  value={draft.taxOffice}
                  onChange={(event) => set({ taxOffice: event.target.value })}
                  maxLength={60}
                  placeholder="Kadıköy"
                  className={accountInput}
                />
              </AccountField>
              <AccountField label="Vergi / TC kimlik no" htmlFor="bill-tax-number">
                <input
                  id="bill-tax-number"
                  value={draft.taxNumber}
                  onChange={(event) => set({ taxNumber: event.target.value })}
                  maxLength={20}
                  placeholder="1234567890"
                  className={accountInput}
                />
              </AccountField>
            </>
          ) : (
            <AccountField label="TC kimlik no (opsiyonel)" htmlFor="bill-tckn" hint="Faturanızda görünmesini isterseniz girin.">
              <input
                id="bill-tckn"
                value={draft.taxNumber}
                onChange={(event) => set({ taxNumber: event.target.value })}
                maxLength={11}
                placeholder="11 haneli numara"
                className={accountInput}
              />
            </AccountField>
          )}

          <AccountField label="Telefon" htmlFor="bill-phone">
            <input
              id="bill-phone"
              value={draft.phone}
              onChange={(event) => set({ phone: event.target.value })}
              maxLength={20}
              placeholder="05xx xxx xx xx"
              className={accountInput}
            />
          </AccountField>
          <AccountField label="Fatura e-postası" htmlFor="bill-email">
            <input
              id="bill-email"
              type="email"
              value={draft.email}
              onChange={(event) => set({ email: event.target.value })}
              maxLength={120}
              placeholder="fatura@mail.com"
              className={accountInput}
            />
          </AccountField>
          <AccountField label="İl" htmlFor="bill-city">
            <input
              id="bill-city"
              value={draft.city}
              onChange={(event) => set({ city: event.target.value })}
              maxLength={40}
              placeholder="İstanbul"
              list="billing-city-options"
              className={accountInput}
            />
            <datalist id="billing-city-options">
              {TR_CITIES.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </AccountField>
          <AccountField label="İlçe" htmlFor="bill-district">
            <input
              id="bill-district"
              value={draft.district}
              onChange={(event) => set({ district: event.target.value })}
              maxLength={40}
              placeholder="Kadıköy"
              className={accountInput}
            />
          </AccountField>
        </div>

        <div className="mt-4">
          <AccountField label="Fatura adresi" htmlFor="bill-address">
            <textarea
              id="bill-address"
              value={draft.addressLine}
              onChange={(event) => set({ addressLine: event.target.value })}
              rows={3}
              maxLength={300}
              placeholder="Mahalle, sokak, no, daire"
              className={accountTextarea}
            />
          </AccountField>
        </div>

        {message && (
          <div className="mt-3">
            <InlineAlert tone="success">{message}</InlineAlert>
          </div>
        )}
        {error && (
          <div className="mt-3">
            <InlineAlert tone="error">{error}</InlineAlert>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <AccountButton onClick={save} loading={saving} icon="ri-save-3-line">
            Fatura Bilgilerini Kaydet
          </AccountButton>
        </div>
      </AccountCard>
    </div>
  );
}