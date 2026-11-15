import type { Product } from "@/types/store";
import { products as baseProducts } from "@/mocks/store";
import { catalogPc } from "@/mocks/catalogPc";
import { catalogPcExtra } from "@/mocks/catalogPcExtra";
import { catalogOffice } from "@/mocks/catalogOffice";
import { catalogPeripheralExtra } from "@/mocks/catalogPeripheralExtra";
import { catalogEnterprise } from "@/mocks/catalogEnterprise";
import { catalogEnterpriseExtra } from "@/mocks/catalogEnterpriseExtra";
import { catalogNetworkExtra } from "@/mocks/catalogNetworkExtra";
import { catalogRetail } from "@/mocks/catalogRetail";
import { catalogSecurityExtra } from "@/mocks/catalogSecurityExtra";
import { catalogConsumerExtra } from "@/mocks/catalogConsumerExtra";
import { catalogCableExtra } from "@/mocks/catalogCableExtra";
import { pcParts } from "@/lib/pcBuilder";
import { applyPriceRule } from "@/lib/pricing";
import { applyAdminProducts } from "@/lib/productAdminStore";

const showcaseProducts: Product[] = [
  ...(baseProducts as Product[]),
  ...catalogPc,
  ...catalogPcExtra,
  ...catalogOffice,
  ...catalogPeripheralExtra,
  ...catalogEnterprise,
  ...catalogEnterpriseExtra,
  ...catalogNetworkExtra,
  ...catalogRetail,
  ...catalogSecurityExtra,
  ...catalogConsumerExtra,
  ...catalogCableExtra,
];

/**
 * Vitrin kataloğu: ana ürün listesi ve kategori bazlı ek ürün dosyaları
 * tek listede birleştirilir. Sistem toplama bileşenleri de aynı kataloğa
 * dahil edilir; böylece kategori sayfalarında listelenir ve sepete eklenebilir.
 * Tüm fiyatlara site geneli zam kuralı burada uygulanır.
 */
/** Yönetici panelinden eklenen ürünler ve fiyat/stok güncellemeleri en son uygulanır. */
export const products: Product[] = applyAdminProducts([
  ...showcaseProducts.map(applyPriceRule),
  ...pcParts,
]);