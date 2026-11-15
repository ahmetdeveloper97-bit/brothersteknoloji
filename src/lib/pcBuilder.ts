import type { PcIssue, PcPart, PcSelection, PcSlot } from "@/types/pcBuilder";
import { pcCpuParts, pcMainboardParts, pcRamParts } from "@/mocks/pcBuilderParts";
import {
  pcCaseParts,
  pcCoolerParts,
  pcGpuParts,
  pcPsuParts,
  pcStorageParts,
} from "@/mocks/pcBuilderParts2";
import { pcKeyboardParts, pcMonitorParts, pcOsParts } from "@/mocks/pcBuilderParts3";
import { applyPriceRule } from "@/lib/pricing";

/** Sistem toplama adımları (sıralama ekrandaki akışı belirler) */
export const pcSlots: PcSlot[] = [
  { id: "cpu", name: "İşlemci", icon: "ri-cpu-line", hint: "Sistemin beyni: Intel veya AMD", required: true },
  { id: "mainboard", name: "Anakart", icon: "ri-grid-fill", hint: "Soket ve bellek tipi işlemciyle uyumlu olmalı", required: true },
  { id: "ram", name: "Bellek (RAM)", icon: "ri-database-2-line", hint: "Anakartın bellek standardına uygun modül", required: true },
  { id: "gpu", name: "Ekran Kartı", icon: "ri-tv-2-line", hint: "Tasarım, oyun ve yapay zekâ için", required: false },
  { id: "storage", name: "Depolama", icon: "ri-hard-drive-2-line", hint: "NVMe SSD, SATA SSD veya HDD", required: true },
  { id: "case", name: "Kasa", icon: "ri-archive-2-line", hint: "Anakart form faktörünü desteklemeli", required: true },
  { id: "psu", name: "Güç Kaynağı", icon: "ri-plug-2-line", hint: "Sistem tüketimini karşılayacak watt değeri", required: true },
  { id: "cooler", name: "İşlemci Soğutucu", icon: "ri-temp-cold-line", hint: "Soket uyumu ve kasa yüksekliği", required: false },
  { id: "monitor", name: "Monitör", icon: "ri-computer-line", hint: "Tam sistem için ekran seçimi", required: false },
  { id: "keyboard", name: "Klavye & Mouse", icon: "ri-keyboard-line", hint: "Giriş birimleri seti", required: false },
  { id: "os", name: "İşletim Sistemi", icon: "ri-window-line", hint: "Lisanslı işletim sistemi", required: false },
];

export const pcParts: PcPart[] = [
  ...pcCpuParts,
  ...pcMainboardParts,
  ...pcRamParts,
  ...pcGpuParts,
  ...pcStorageParts,
  ...pcCaseParts,
  ...pcPsuParts,
  ...pcCoolerParts,
  ...pcMonitorParts,
  ...pcKeyboardParts,
  ...pcOsParts,
].map((part) => applyPriceRule(part));

const partIndex = new Map<string, PcPart>(pcParts.map((part) => [part.id, part]));

export const getPart = (id: string | undefined): PcPart | undefined =>
  id ? partIndex.get(id) : undefined;

export const partsOfSlot = (slot: string): PcPart[] => pcParts.filter((part) => part.slot === slot);

export const selectedPart = (selection: PcSelection, slot: string): PcPart | undefined =>
  getPart(selection[slot]);

/** Tahmini sistem tüketimi (W) */
export const estimateWattage = (selection: PcSelection): number => {
  const cpu = selectedPart(selection, "cpu");
  const gpu = selectedPart(selection, "gpu");
  const gpuLoad = gpu?.requiredWatt ? Math.round(gpu.requiredWatt * 0.6) : 0;
  return (cpu?.tdp ?? 0) + gpuLoad + 60;
};

export interface BuildCheck {
  issues: PcIssue[];
  warnings: PcIssue[];
  wattage: number;
  total: number;
  selectedCount: number;
  requiredCount: number;
  missingRequired: PcSlot[];
}

const addIssue = (list: PcIssue[], slot: PcSlot["id"], message: string) => {
  if (!list.some((issue) => issue.slot === slot && issue.message === message)) {
    list.push({ slot, message });
  }
};

/** Seçilen bileşenlerin uyumluluğunu denetler. */
export const checkBuild = (selection: PcSelection): BuildCheck => {
  const issues: PcIssue[] = [];
  const warnings: PcIssue[] = [];

  const cpu = selectedPart(selection, "cpu");
  const mainboard = selectedPart(selection, "mainboard");
  const ram = selectedPart(selection, "ram");
  const gpu = selectedPart(selection, "gpu");
  const pcCase = selectedPart(selection, "case");
  const psu = selectedPart(selection, "psu");
  const cooler = selectedPart(selection, "cooler");

  if (cpu && mainboard && cpu.socket && mainboard.socket && cpu.socket !== mainboard.socket) {
    addIssue(
      issues,
      "mainboard",
      `Anakart soketi (${mainboard.socket}) işlemci soketiyle (${cpu.socket}) uyumlu değil.`
    );
  }

  if (mainboard && cpu && mainboard.memoryType && cpu.memorySupport) {
    if (!cpu.memorySupport.includes(mainboard.memoryType)) {
      addIssue(
        issues,
        "mainboard",
        `Bu işlemci ${cpu.memorySupport.join(" / ")} bellek destekliyor, seçilen anakart ${mainboard.memoryType}.`
      );
    }
  }

  if (mainboard && ram && mainboard.memoryType && ram.memoryType) {
    if (mainboard.memoryType !== ram.memoryType) {
      addIssue(issues, "ram", `Anakart ${mainboard.memoryType} bellek kullanıyor, seçilen modül ${ram.memoryType}.`);
    }
  }

  if (mainboard && pcCase && mainboard.formFactor && pcCase.supportedFormFactors) {
    if (!pcCase.supportedFormFactors.includes(mainboard.formFactor)) {
      addIssue(
        issues,
        "case",
        `Kasa ${mainboard.formFactor} anakartı desteklemiyor. Desteklenen: ${pcCase.supportedFormFactors.join(", ")}.`
      );
    }
  }

  if (gpu && pcCase && gpu.lengthMm && pcCase.maxLengthMm && gpu.lengthMm > pcCase.maxLengthMm) {
    addIssue(
      issues,
      "case",
      `Ekran kartı ${gpu.lengthMm} mm, kasa en fazla ${pcCase.maxLengthMm} mm kabul ediyor.`
    );
  }

  if (cooler && pcCase && cooler.heightMm && pcCase.maxHeightMm && cooler.heightMm > pcCase.maxHeightMm) {
    addIssue(
      issues,
      "cooler",
      `Soğutucu yüksekliği ${cooler.heightMm} mm, kasa sınırı ${pcCase.maxHeightMm} mm.`
    );
  }

  if (cooler && cpu && cooler.sockets && cpu.socket && !cooler.sockets.includes(cpu.socket)) {
    addIssue(issues, "cooler", `Bu soğutucu ${cpu.socket} soketini desteklemiyor.`);
  }

  const wattage = estimateWattage(selection);
  if (psu && psu.wattage) {
    if (psu.wattage < wattage) {
      addIssue(issues, "psu", `Tahmini tüketim ${wattage} W; seçilen güç kaynağı ${psu.wattage} W yetersiz.`);
    } else if (psu.wattage - wattage < 80) {
      addIssue(warnings, "psu", `Güç kaynağı sınırda çalışıyor (${psu.wattage} W / ${wattage} W). Bir üst model önerilir.`);
    }
  }

  const selected = pcSlots
    .map((slot) => ({ slot, part: selectedPart(selection, slot.id) }))
    .filter((entry) => Boolean(entry.part));

  const total = selected.reduce((sum, entry) => sum + (entry.part?.price ?? 0), 0);

  return {
    issues,
    warnings,
    wattage,
    total,
    selectedCount: selected.length,
    requiredCount: pcSlots.filter((slot) => slot.required).length,
    missingRequired: pcSlots.filter((slot) => slot.required && !selection[slot.id]),
  };
};

/** Belirli bir bileşen için uyumsuzluk nedenini döndürür (seçim ekranında göstermek için). */
export const incompatibilityReason = (
  part: PcPart,
  selection: PcSelection
): string | null => {
  const cpu = selectedPart(selection, "cpu");
  const mainboard = selectedPart(selection, "mainboard");
  const ram = selectedPart(selection, "ram");
  const pcCase = selectedPart(selection, "case");
  const gpu = selectedPart(selection, "gpu");
  const cooler = selectedPart(selection, "cooler");

  if (part.slot === "cpu" && mainboard) {
    if (part.socket && mainboard.socket && part.socket !== mainboard.socket) {
      return `Seçili anakart ${mainboard.socket} soketli`;
    }
    if (part.memorySupport && mainboard.memoryType && !part.memorySupport.includes(mainboard.memoryType)) {
      return `Seçili anakart ${mainboard.memoryType} bellek kullanıyor`;
    }
  }

  if (part.slot === "mainboard") {
    if (cpu?.socket && part.socket && cpu.socket !== part.socket) {
      return `Seçili işlemci ${cpu.socket} soketli`;
    }
    if (cpu?.memorySupport && part.memoryType && !cpu.memorySupport.includes(part.memoryType)) {
      return `Seçili işlemci ${cpu.memorySupport.join("/")} destekliyor`;
    }
    if (pcCase?.supportedFormFactors && part.formFactor) {
      if (!pcCase.supportedFormFactors.includes(part.formFactor)) {
        return `Seçili kasa ${part.formFactor} desteklemiyor`;
      }
    }
  }

  if (part.slot === "ram" && mainboard?.memoryType && part.memoryType !== mainboard.memoryType) {
    return `Seçili anakart ${mainboard.memoryType} kullanıyor`;
  }

  if (part.slot === "case") {
    if (mainboard?.formFactor && part.supportedFormFactors) {
      if (!part.supportedFormFactors.includes(mainboard.formFactor)) {
        return `Seçili anakart ${mainboard.formFactor}`;
      }
    }
    if (gpu?.lengthMm && part.maxLengthMm && gpu.lengthMm > part.maxLengthMm) {
      return `Seçili ekran kartı ${gpu.lengthMm} mm`;
    }
    if (cooler?.heightMm && part.maxHeightMm && cooler.heightMm > part.maxHeightMm) {
      return `Seçili soğutucu ${cooler.heightMm} mm`;
    }
  }

  if (part.slot === "cooler") {
    if (cpu?.socket && part.sockets && !part.sockets.includes(cpu.socket)) {
      return `Seçili işlemci ${cpu.socket} soketli`;
    }
    if (pcCase?.maxHeightMm && part.heightMm && part.heightMm > pcCase.maxHeightMm) {
      return `Seçili kasa sınırı ${pcCase.maxHeightMm} mm`;
    }
  }

  return null;
};