import { useEffect, useState } from "react";
import { fetchBankAccounts, getBankAccounts, subscribeBankAccounts } from "@/lib/bankAccounts";
import type { BankAccountsSettings } from "@/types/bankAccount";

export function useBankAccounts(): { settings: BankAccountsSettings; loading: boolean } {
  const [settings, setSettings] = useState<BankAccountsSettings>(() => getBankAccounts());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const sync = () => setSettings(getBankAccounts());
    const unsubscribe = subscribeBankAccounts(sync);

    void fetchBankAccounts()
      .then((next) => {
        if (active) setSettings(next);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return { settings, loading };
}