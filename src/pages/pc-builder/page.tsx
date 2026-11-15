import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import SlotRail from "@/pages/pc-builder/components/SlotRail";
import PartPicker from "@/pages/pc-builder/components/PartPicker";
import BuildSummary from "@/pages/pc-builder/components/BuildSummary";
import { checkBuild, pcSlots, selectedPart } from "@/lib/pcBuilder";
import { useCart } from "@/context/CartContext";
import type { PcSelection, PcSlotId } from "@/types/pcBuilder";

const steps = [
  { icon: "ri-list-check-2", title: "Bileşenleri seçin", text: "İşlemciden kasaya kadar adım adım ilerleyin." },
  { icon: "ri-shield-check-line", title: "Uyumluluk kontrolü", text: "Soket, bellek ve güç uyumu otomatik denetlenir." },
  { icon: "ri-shopping-cart-2-line", title: "Tek sepette toplayın", text: "Seçtiğiniz tüm bileşenler sepete birlikte eklenir." },
];

export default function PcBuilderPage() {
  const [selection, setSelection] = useState<PcSelection>({});
  const [activeSlot, setActiveSlot] = useState<PcSlotId>("cpu");
  const { addToCart } = useCart();

  const check = useMemo(() => checkBuild(selection), [selection]);
  const active = pcSlots.find((slot) => slot.id === activeSlot) ?? pcSlots[0];

  const pickPart = (partId: string) => {
    const alreadySelected = Boolean(selection[activeSlot]);
    const nextSelection = { ...selection, [activeSlot]: partId };
    setSelection(nextSelection);
    if (alreadySelected) return;
    const currentIndex = pcSlots.findIndex((slot) => slot.id === activeSlot);
    const nextEmpty = pcSlots.slice(currentIndex + 1).find((slot) => !selectedPart(nextSelection, slot.id));
    if (nextEmpty) setActiveSlot(nextEmpty.id);
  };

  const removeSlot = (slotId: string) => {
    setSelection((current) => {
      const next = { ...current };
      delete next[slotId];
      return next;
    });
  };

  const addBuildToCart = () => {
    const chosen = pcSlots
      .map((slot) => selectedPart(selection, slot.id))
      .filter((part) => Boolean(part));
    chosen.forEach((part) => {
      if (!part) return;
      addToCart(part.id, 1, { variantLabel: "Sistem Toplama", unitPrice: part.price });
    });
  };

  return (
    <StoreLayout>
      <div className="border-b border-background-200 bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-8 md:py-10">
          <nav className="flex items-center gap-1.5 text-xs text-primary-200">
            <Link to="/" className="hover:text-background-50">
              Anasayfa
            </Link>
            <i className="ri-arrow-right-s-line" />
            <span className="text-background-50">Sistem Toplama</span>
          </nav>
          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-background-50/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-200">
                  PC Topla
                </span>
                <span className="text-[11px] text-primary-200">Kurumsal ve bireysel</span>
              </div>
              <h1 className="mt-2 font-heading text-2xl font-extrabold text-background-50 md:text-4xl">
                Kendi sisteminizi toplayın
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-primary-100">
                İşlemci, anakart, bellek, ekran kartı ve daha fazlasını seçin. Uyumluluk kontrolü ve tahmini güç
                tüketimi anında hesaplanır, tüm bileşenler tek sepette birleşir.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:w-auto">
              {steps.map((step) => (
                <div
                  key={step.title}
                  className="flex items-start gap-2 rounded-xl border border-background-50/15 bg-background-50/10 px-3 py-2.5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background-50/15 text-background-50">
                    <i className={`${step.icon} text-xs`} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-background-50">{step.title}</p>
                    <p className="mt-0.5 hidden text-[10px] leading-snug text-primary-200 sm:block">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[268px_minmax(0,1fr)] xl:grid-cols-[268px_minmax(0,1fr)_312px]">
          <div className="min-w-0">
            <SlotRail
              slots={pcSlots}
              selection={selection}
              activeSlot={activeSlot}
              issueSlots={check.issues.map((issue) => issue.slot)}
              onSelect={setActiveSlot}
            />
          </div>

          <div className="min-w-0">
            <PartPicker slot={active} selection={selection} onPick={pickPart} />
          </div>

          <div className="min-w-0 xl:block">
            <BuildSummary
              slots={pcSlots}
              selection={selection}
              check={check}
              onRemove={removeSlot}
              onSelectSlot={(slotId) => setActiveSlot(slotId as PcSlotId)}
              onClear={() => setSelection({})}
              onAddToCart={addBuildToCart}
            />
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-background-200 bg-background-100 p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background-50 text-primary-700">
                <i className="ri-information-line text-lg" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground-900">Hazır sistem mi arıyorsunuz?</p>
                <p className="mt-0.5 text-xs text-foreground-600">
                  Katalogdaki masaüstü ve iş istasyonu modellerini inceleyebilir, toplu alımlarda teklif isteyebilirsiniz.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/kategoriler/masaustu-bilgisayarlar"
                className="whitespace-nowrap rounded-lg bg-background-50 px-4 py-2 text-xs font-semibold text-foreground-900 hover:bg-background-200"
              >
                Masaüstü Bilgisayarlar
              </Link>
              <Link
                to="/kategoriler/is-istasyonlari"
                className="whitespace-nowrap rounded-lg bg-primary-700 px-4 py-2 text-xs font-semibold text-background-50 hover:bg-primary-600"
              >
                İş İstasyonları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}