import { useEffect, useState } from "react";
import { fetchQuickLinks, getQuickLinks, subscribeQuickLinks, visibleQuickLinks } from "@/lib/quickLinks";
import type { QuickLinkItem } from "@/types/quickLink";

/** Mağaza vitrininde gösterilecek aktif kısayolları döner. */
export function useQuickLinks(): QuickLinkItem[] {
  const [items, setItems] = useState<QuickLinkItem[]>(() => visibleQuickLinks(getQuickLinks()));

  useEffect(() => {
    let active = true;
    const sync = () => setItems(visibleQuickLinks(getQuickLinks()));
    sync();
    const unsubscribe = subscribeQuickLinks(sync);
    void fetchQuickLinks().then(() => {
      if (active) sync();
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return items;
}