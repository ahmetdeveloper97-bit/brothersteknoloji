import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { ProfileRow } from "@/types/account";

const LEGACY_SESSION_KEY = "eticaretv8_user";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: ProfileRow | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readProfile = async (user: User): Promise<ProfileRow | null> => {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (error) return null;
    if (data) return data as ProfileRow;

    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    const guessedName = (meta.full_name as string) || (meta.name as string) || "";
    const { data: created, error: createError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email ?? null,
        full_name: guessedName || null,
        phone: user.phone ?? null,
      })
      .select("*")
      .maybeSingle();
    if (createError) return null;
    return (created as ProfileRow | null) ?? null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session ?? null);
        setLoading(false);
        if (data.session?.user) {
          const currentUser = data.session.user;
          window.setTimeout(() => {
            if (!active) return;
            void readProfile(currentUser).then((row) => {
              if (active && row) setProfile(row);
            });
          }, 0);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);

      if (nextSession?.user) {
        try {
          window.localStorage.setItem(LEGACY_SESSION_KEY, JSON.stringify({ email: nextSession.user.email }));
        } catch {
          /* storage may be unavailable */
        }
        const currentUser = nextSession.user;
        window.setTimeout(() => {
          if (!active) return;
          void readProfile(currentUser).then((row) => {
            if (active && row) setProfile(row);
          });
        }, 0);
      } else {
        try {
          window.localStorage.removeItem(LEGACY_SESSION_KEY);
        } catch {
          /* storage may be unavailable */
        }
        setProfile(null);
      }
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    const user = session?.user;
    if (!user) return;
    const row = await readProfile(user);
    if (row) setProfile(row);
  }, [session]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ session, user: session?.user ?? null, profile, loading, refreshProfile, signOut }),
    [session, profile, loading, refreshProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}