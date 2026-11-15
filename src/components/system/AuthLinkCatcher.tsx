import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CALLBACK_PATH = "/auth/callback";

const QUERY_KEYS = ["code", "token_hash", "type", "error", "error_code", "error_description"];

const readHashParams = (hash: string): URLSearchParams => {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(raw);
};

/**
 * Supabase onay / sıfırlama bağlantıları bazen kök adrese düşer.
 * Burada yakalanıp tek bir yerde (/auth/callback) işlenir.
 */
export default function AuthLinkCatcher() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === CALLBACK_PATH) return;

    const searchParams = new URLSearchParams(location.search);
    const hashParams = readHashParams(location.hash);

    const hasQueryAuth = QUERY_KEYS.some((key) => searchParams.has(key));
    const hasHashAuth = hashParams.has("access_token") || hashParams.has("error") || hashParams.has("token_hash");

    if (!hasQueryAuth && !hasHashAuth) return;

    navigate(`${CALLBACK_PATH}${location.search}${location.hash}`, { replace: true });
  }, [location.pathname, location.search, location.hash, navigate]);

  return null;
}