import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import WhatsAppWidget from "@/components/storefront/WhatsAppWidget";
import AiSupportWidget from "@/components/storefront/AiSupportWidget";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background-50">
      <Header />
      <main className="pt-[76px] lg:pt-[292px]">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppWidget />
      <AiSupportWidget />
    </div>
  );
}