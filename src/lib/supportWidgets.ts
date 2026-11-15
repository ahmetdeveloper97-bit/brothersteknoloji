export type SupportWidgetSource = "whatsapp" | "ai";

const SUPPORT_PANEL_EVENT = "readdy:support-panel";

export const emitSupportPanel = (source: SupportWidgetSource, open: boolean): void => {
  try {
    window.dispatchEvent(new CustomEvent(SUPPORT_PANEL_EVENT, { detail: { source, open } }));
  } catch {
    /* event desteklenmiyorsa sessizce geç */
  }
};

export const subscribeSupportPanel = (
  callback: (detail: { source: SupportWidgetSource; open: boolean }) => void,
): (() => void) => {
  const handler = (event: Event): void => {
    const detail = (event as CustomEvent<{ source: SupportWidgetSource; open: boolean }>).detail;
    if (!detail || !detail.source) return;
    callback({ source: detail.source, open: Boolean(detail.open) });
  };
  window.addEventListener(SUPPORT_PANEL_EVENT, handler);
  return () => window.removeEventListener(SUPPORT_PANEL_EVENT, handler);
};