import { useEffect, useState } from "react";
import { fetchPublicPages, getCachedPublicPages, subscribePublicPages } from "@/lib/sitePages";
import type { SitePageSummary } from "@/types/sitePage";

/** Yayındaki sayfaların özet listesini döndürür ve güncellemeleri dinler. */
export const usePublicPages = (): SitePageSummary[] => {
  const [pages, setPages] = useState<SitePageSummary[]>(() => getCachedPublicPages());

  useEffect(() => {
    let active = true;
    const sync = () => {
      if (active) setPages(getCachedPublicPages());
    };
    const unsubscribe = subscribePublicPages(sync);
    void fetchPublicPages().then(sync).catch(() => undefined);

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return pages;
};

export default usePublicPages;