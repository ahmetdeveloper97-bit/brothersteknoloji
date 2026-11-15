/**
 * Önceki sürümlerden tarayıcıda kalan demo kayıtları bir kez temizler.
 * Gerçek ödemeler (eticaretv8_payments) ve mağaza ayarları korunur.
 */
const CLEANUP_MARKER = "eticaretv8_demo_cleanup_v1";

const DEMO_STORAGE_KEYS = [
  "eticaretv8_admin_order_status",
  "eticaretv8_admin_customers",
  "eticaretv8_admin_campaigns",
  "eticaretv8_admin_reviews",
  "eticaretv8_admin_activity",
  "eticaretv8_support_tasks",
  "eticaretv8_shipments",
  "eticaretv8_ads_campaigns",
  "eticaretv8_ads_campaigns_series",
  "eticaretv8_ads_conversions",
  "eticaretv8_abandoned_carts",
  "eticaretv8_sms_logs",
  "eticaretv8_sms_contacts",
  "eticaretv8_live_support",
];

export const purgeDemoData = (): void => {
  try {
    if (window.localStorage.getItem(CLEANUP_MARKER)) return;
    DEMO_STORAGE_KEYS.forEach((key) => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        /* tek anahtar silinemezse devam et */
      }
    });
    window.localStorage.setItem(CLEANUP_MARKER, new Date().toISOString());
  } catch {
    /* storage may be unavailable */
  }
};