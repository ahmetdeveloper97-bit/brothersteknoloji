import { useEffect, useState } from "react";
import {
  fetchShowcasePages,
  getShowcasePage,
  subscribeShowcasePages,
  type ShowcasePageKey,
} from "@/lib/showcasePages";
import type { ShowcasePageSettings } from "@/types/showcasePage";

/** Tek bir vitrin sayfasının ayarlarını döner ve güncellemeleri takip eder. */
export function useShowcasePage(key: ShowcasePageKey): ShowcasePageSettings {
  const [page, setPage] = useState<ShowcasePageSettings>(() => getShowcasePage(key));

  useEffect(() => {
    let active = true;
    const sync = () => setPage(getShowcasePage(key));
    sync();
    const unsubscribe = subscribeShowcasePages(sync);
    void fetchShowcasePages().then(() => {
      if (active) sync();
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [key]);

  return page;
}