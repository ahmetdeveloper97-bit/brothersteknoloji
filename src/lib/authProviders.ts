import { isSupabaseConfigured } from "@/lib/supabase";

export type ProviderState = "enabled" | "disabled" | "unknown";

export type AuthProviderReport = {
  email: ProviderState;
  google: ProviderState;
  apple: ProviderState;
  reachable: boolean;
  message: string;
};

const supabaseUrl = (import.meta.env.VITE_PUBLIC_SUPABASE_URL as string | undefined) ?? "";
const supabaseAnonKey = (import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY as string | undefined) ?? "";

type SettingsResponse = {
  external?: Record<string, boolean>;
};

const toState = (value: boolean | undefined): ProviderState => {
  if (value === true) return "enabled";
  if (value === false) return "disabled";
  return "unknown";
};

/**
 * Reads the public GoTrue settings endpoint with the anon key and reports
 * which sign-in providers are actually enabled for this project.
 */
export async function fetchAuthProviderReport(): Promise<AuthProviderReport> {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    return {
      email: "unknown",
      google: "unknown",
      apple: "unknown",
      reachable: false,
      message: "Bağlantı bilgileri okunamadı. Ortam değişkenleri eksik görünüyor.",
    };
  }

  try {
    const response = await fetch(`${supabaseUrl.replace(/\/+$/, "")}/auth/v1/settings`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });

    if (!response.ok) {
      return {
        email: "unknown",
        google: "unknown",
        apple: "unknown",
        reachable: false,
        message: `Supabase yanıt vermedi (HTTP ${response.status}).`,
      };
    }

    const data = (await response.json()) as SettingsResponse;
    const external = data.external ?? {};
    return {
      email: toState(external.email),
      google: toState(external.google),
      apple: toState(external.apple),
      reachable: true,
      message: "Supabase kimlik doğrulama servisine ulaşıldı.",
    };
  } catch {
    return {
      email: "unknown",
      google: "unknown",
      apple: "unknown",
      reachable: false,
      message: "Ağ bağlantısı kurulamadı. Alan adı veya internet bağlantısını kontrol edin.",
    };
  }
}