const STORAGE_KEY = "bt.auth.emailCooldown";

type CooldownMap = Record<string, number>;

const readMap = (): CooldownMap => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CooldownMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeMap = (map: CooldownMap): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* storage kapalı olabilir, sessizce geç */
  }
};

/** Belirli bir e-posta için kalan bekleme süresini saniye olarak döndürür. */
export function remainingCooldownSeconds(email: string): number {
  const key = email.trim().toLowerCase();
  if (!key) return 0;
  const expiresAt = readMap()[key] ?? 0;
  const remaining = Math.ceil((expiresAt - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
}

/** E-posta gönderiminden sonra tekrar deneme kilidini başlatır. */
export function startEmailCooldown(email: string, seconds = 60): void {
  const key = email.trim().toLowerCase();
  if (!key) return;
  const map = readMap();
  map[key] = Date.now() + seconds * 1000;
  writeMap(map);
}

/** Kalan süreyi "1:05" biçiminde gösterir. */
export function formatCooldown(seconds: number): string {
  const safe = Math.max(seconds, 0);
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}