import { useEffect, useState } from "react";
import {
  announcementLine,
  fetchAnnouncementSettings,
  getAnnouncementSettings,
  subscribeAnnouncementSettings,
} from "@/lib/announcementSettings";

/** Üst şeritte kayarak geçecek güncel duyuru metnini döner. Boşsa şerit gizlenir. */
export function useAnnouncementBanner(): string {
  const [text, setText] = useState<string>(() => announcementLine(getAnnouncementSettings()));

  useEffect(() => {
    let active = true;
    const sync = () => setText(announcementLine(getAnnouncementSettings()));
    sync();
    const unsubscribe = subscribeAnnouncementSettings(sync);
    void fetchAnnouncementSettings().then(() => {
      if (active) sync();
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return text;
}