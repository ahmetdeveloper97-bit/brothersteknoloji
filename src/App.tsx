import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { AuthProvider } from "./context/AuthContext";
import CookieConsent from "./components/layout/CookieConsent";
import MaintenanceGate from "./components/system/MaintenanceGate";
import ScrollToTop from "@/components/system/ScrollToTop";
import AuthLinkCatcher from "@/components/system/AuthLinkCatcher";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <ScrollToTop />
        <AuthLinkCatcher />
        <MaintenanceGate>
          <AuthProvider>
            <FavoritesProvider>
              <CartProvider>
                <AppRoutes />
                <CookieConsent />
              </CartProvider>
            </FavoritesProvider>
          </AuthProvider>
        </MaintenanceGate>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;