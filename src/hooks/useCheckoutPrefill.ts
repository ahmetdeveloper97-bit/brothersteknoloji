import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { AddressRow, BillingProfileRow } from "@/types/account";

interface CheckoutPrefill {
  addresses: AddressRow[];
  billing: BillingProfileRow | null;
  loading: boolean;
  error: string;
}

/**
 * Loads the signed-in customer's saved delivery addresses and billing profile
 * so the checkout form can be filled automatically.
 */
export function useCheckoutPrefill(userId?: string): CheckoutPrefill {
  const [addresses, setAddresses] = useState<AddressRow[]>([]);
  const [billing, setBilling] = useState<BillingProfileRow | null>(null);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setAddresses([]);
      setBilling(null);
      setLoading(false);
      setError("");
      return;
    }

    let active = true;
    setLoading(true);
    setError("");

    const load = async () => {
      try {
        const [addressResult, billingResult] = await Promise.all([
          supabase
            .from("addresses")
            .select("*")
            .eq("user_id", userId)
            .order("is_default", { ascending: false })
            .order("created_at", { ascending: false }),
          supabase.from("billing_profiles").select("*").eq("user_id", userId).maybeSingle(),
        ]);

        if (!active) return;
        if (addressResult.error) throw addressResult.error;

        setAddresses((addressResult.data ?? []) as AddressRow[]);
        setBilling((billingResult.data ?? null) as BillingProfileRow | null);
      } catch {
        if (active) setError("Kayıtlı adres ve fatura bilgileri yüklenemedi.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [userId]);

  return { addresses, billing, loading, error };
}

export default useCheckoutPrefill;