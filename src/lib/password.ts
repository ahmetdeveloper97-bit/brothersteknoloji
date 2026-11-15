export const hashPassword = (value: string): string => {
  let forward = 5381;
  for (let index = 0; index < value.length; index += 1) {
    forward = (forward * 33 + value.charCodeAt(index)) % 2147483647;
  }
  let backward = 7;
  for (let index = value.length - 1; index >= 0; index -= 1) {
    backward = (backward * 31 + value.charCodeAt(index)) % 2147483647;
  }
  return `v1$${forward.toString(36)}$${backward.toString(36)}$${value.length}`;
};

export const verifyPassword = (stored: string | undefined, input: string): boolean => {
  if (!stored || !input) return false;
  if (stored.startsWith("v1$")) return stored === hashPassword(input);
  return stored === input;
};

export const generatePassword = (): string => {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const digits = "23456789";
  const pool = `${letters}${letters.toLowerCase()}${digits}`;
  let result = "";
  while (result.length < 8) {
    const index = Math.floor(Math.random() * pool.length);
    result += pool.charAt(index);
  }
  return `${result}${Math.floor(Math.random() * 90) + 10}`;
};

export const passwordStrength = (value: string): { score: number; label: string } => {
  let score = 0;
  if (value.length >= 6) score += 1;
  if (value.length >= 10) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  const labels = ["Çok zayıf", "Zayıf", "Orta", "İyi", "Güçlü"];
  return { score, label: labels[Math.min(score, 4)] };
};