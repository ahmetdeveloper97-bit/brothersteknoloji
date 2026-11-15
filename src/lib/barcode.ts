/**
 * Code 39 barkod üretici.
 * Kargo takip numaraları (harf + rakam + tire) için en yaygın kullanılan
 * endüstriyel barkod standardıdır ve termal barkod yazıcıların tamamı destekler.
 */

const CODE39_PATTERNS: Record<string, string> = {
  "0": "000110100",
  "1": "100100001",
  "2": "001100001",
  "3": "101100000",
  "4": "000110001",
  "5": "100110000",
  "6": "001110000",
  "7": "000100101",
  "8": "100100100",
  "9": "001100100",
  A: "100001001",
  B: "001001001",
  C: "101001000",
  D: "000011001",
  E: "100011000",
  F: "001011000",
  G: "000001101",
  H: "100001100",
  I: "001001100",
  J: "000011100",
  K: "100000011",
  L: "001000011",
  M: "101000010",
  N: "000010011",
  O: "100010010",
  P: "001010010",
  Q: "000000111",
  R: "100000110",
  S: "001000110",
  T: "000010110",
  U: "110000001",
  V: "011000001",
  W: "111000000",
  X: "010010001",
  Y: "110010000",
  Z: "011010000",
  "-": "010000101",
  ".": "110000100",
  " ": "011000100",
  $: "010101000",
  "/": "010100010",
  "+": "010001010",
  "%": "000101010",
  "*": "010010100",
};

export interface BarcodeBar {
  dark: boolean;
  /** Modül cinsinden genişlik (1 = dar, 3 = geniş) */
  width: number;
}

export interface EncodedBarcode {
  bars: BarcodeBar[];
  text: string;
  modules: number;
}

/** Barkodda kullanılamayan karakterleri temizler. */
export const sanitizeBarcodeText = (raw: string): string =>
  (raw || "")
    .toUpperCase()
    .replace(/[^0-9A-Z\-. $/+%]/g, "")
    .slice(0, 40);

/** Bootstrap/terminal'de barkodun okunabilmesi için sessiz bölge karakteri. */
export const encodeCode39 = (raw: string, wideRatio = 3): EncodedBarcode => {
  const text = sanitizeBarcodeText(raw);
  if (!text) return { bars: [], text: "", modules: 0 };

  const chars = `*${text}*`;
  const bars: BarcodeBar[] = [];
  let modules = 0;

  chars.split("").forEach((char, charIndex) => {
    const pattern = CODE39_PATTERNS[char];
    if (!pattern) return;
    pattern.split("").forEach((bit, index) => {
      const dark = index % 2 === 0;
      const width = bit === "1" ? wideRatio : 1;
      bars.push({ dark, width });
      modules += width;
    });
    if (charIndex < chars.length - 1) {
      bars.push({ dark: false, width: 1 });
      modules += 1;
    }
  });

  return { bars, text, modules };
};

/** Yazıcı test etiketi için sabit barkod değeri üretir. */
export const printerTestBarcode = (): string => `TEST-${String(Date.now()).slice(-8)}`;