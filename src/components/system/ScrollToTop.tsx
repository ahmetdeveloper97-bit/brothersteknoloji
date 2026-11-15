import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Sayfa değiştiğinde görünümü en başa alır.
 * Böylece ürün listelerinin alt kısmından bir ürüne tıklandığında,
 * açılan ürün sayfası listenin ortasından değil baştan görünür.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.replace("#", ""));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}