const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const TOTP_PERIOD = 30;
const TOTP_DIGITS = 6;

export const base32Encode = (bytes: Uint8Array): string => {
  let bits = 0;
  let value = 0;
  let output = "";
  bytes.forEach((byte) => {
    value = ((value << 8) | byte) & 0xffff;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  });
  if (bits > 0) output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  return output;
};

export const base32Decode = (input: string): Uint8Array => {
  const clean = input.replace(/=+$/g, "").replace(/\s+/g, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of clean) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index < 0) continue;
    value = ((value << 5) | index) & 0xffff;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(bytes);
};

export const generateTotpSecret = (byteLength = 20): string => {
  const bytes = new Uint8Array(byteLength);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < byteLength; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  return base32Encode(bytes);
};

export const buildOtpAuthUri = (issuer: string, account: string, secret: string): string => {
  const label = `${issuer}:${account}`;
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: "SHA1",
    digits: String(TOTP_DIGITS),
    period: String(TOTP_PERIOD),
  });
  return `otpauth://totp/${encodeURIComponent(label)}?${params.toString()}`;
};

const hmacSha1 = async (keyBytes: Uint8Array, messageBytes: Uint8Array): Promise<Uint8Array> => {
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, messageBytes);
  return new Uint8Array(signature);
};

export const generateTotpCode = async (secret: string, timestamp = Date.now()): Promise<string> => {
  const counter = Math.floor(timestamp / 1000 / TOTP_PERIOD);
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setUint32(4, counter >>> 0);

  const digest = await hmacSha1(base32Decode(secret), new Uint8Array(buffer));
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  return String(binary % 10 ** TOTP_DIGITS).padStart(TOTP_DIGITS, "0");
};

export const verifyTotpCode = async (secret: string, code: string, windowSize = 1): Promise<boolean> => {
  const clean = code.replace(/\D/g, "");
  if (!secret || clean.length !== TOTP_DIGITS) return false;

  const now = Date.now();
  for (let offset = -windowSize; offset <= windowSize; offset += 1) {
    const candidate = await generateTotpCode(secret, now + offset * TOTP_PERIOD * 1000);
    if (candidate === clean) return true;
  }
  return false;
};

export const formatSecretGroups = (secret: string): string =>
  secret
    .replace(/\s+/g, "")
    .toUpperCase()
    .replace(/(.{4})/g, "$1 ")
    .trim();

export const totpSecondsRemaining = (): number => {
  const seconds = Math.floor(Date.now() / 1000);
  return TOTP_PERIOD - (seconds % TOTP_PERIOD);
};