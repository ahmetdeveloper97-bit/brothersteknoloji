import { absoluteUrl } from "@/lib/supabase";

export const DEFAULT_POST_AUTH_PATH = "/hesabim";

const AUTH_ROUTE_PATHS = [
  "/giris",
  "/giris-yap",
  "/uye-ol",
  "/sifre-sifirla",
  "/auth",
];

const isAuthRoute = (path: string): boolean => {
  const clean = path.toLowerCase().replace(/\/+$/, "") || "/";
  return AUTH_ROUTE_PATHS.some((route) => clean === route || clean.startsWith(`${route}/`));
};

/**
 * Only allows internal, same-origin destinations for ordinary sign-in flows.
 * Anything suspicious falls back to the account page.
 */
export function validateOrdinaryPostAuthNext(value: string | null | undefined): string {
  if (!value) return DEFAULT_POST_AUTH_PATH;
  const candidate = value.trim();
  if (!candidate.startsWith("/")) return DEFAULT_POST_AUTH_PATH;
  if (candidate.startsWith("//")) return DEFAULT_POST_AUTH_PATH;

  let normalized = "";
  try {
    const url = new URL(candidate, window.location.origin);
    if (url.origin !== window.location.origin) return DEFAULT_POST_AUTH_PATH;
    normalized = `${url.pathname}${url.search}`;
  } catch {
    return DEFAULT_POST_AUTH_PATH;
  }

  const pathOnly = normalized.split("?")[0];
  if (isAuthRoute(pathOnly)) return DEFAULT_POST_AUTH_PATH;
  if (normalized === "/" || normalized === "") return DEFAULT_POST_AUTH_PATH;
  return normalized;
}

/** Builds the OAuth callback URL that keeps a validated destination after sign-in. */
export function oauthCallbackUrl(next?: string): string {
  const target = next ? validateOrdinaryPostAuthNext(next) : DEFAULT_POST_AUTH_PATH;
  if (target === DEFAULT_POST_AUTH_PATH) return absoluteUrl("/auth/callback");
  return absoluteUrl(`/auth/callback?next=${encodeURIComponent(target)}`);
}