import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

// ─────────────────────────────────────────────────────────────────────────
// Unified auth state — used by both customers and admins.
//
//   user         → current Supabase auth user (or null)
//   isAuthed     → user is signed in
//   isAdmin      → signed in AND email is allowlisted (front-end hint;
//                  Postgres is_admin() RLS is the real authority)
//
// Methods all return { ok: true } on success, throw on error so callers
// can wrap them in try/catch.
// ─────────────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isAdminEmail(email) {
  if (!email) return false;
  if (ADMIN_EMAILS.length === 0) return true; // defer to RLS if list is empty
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

const oauthRedirectTo = () =>
  typeof window !== 'undefined' ? `${window.location.origin}/account` : undefined;

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo(() => {
    const user = session?.user ?? null;
    const email = user?.email ?? null;

    return {
      configured: isSupabaseConfigured,
      loading,
      session,
      user,
      email,
      isAuthed: !!user,
      isAdmin: !!user && isAdminEmail(email),
      adminEmails: ADMIN_EMAILS,

      // Magic-link OTP. Sends an email; user taps link → redirected back signed in.
      async signInWithEmail(targetEmail, redirectPath = '/account') {
        if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
        const { error } = await supabase.auth.signInWithOtp({
          email: targetEmail,
          options: {
            shouldCreateUser: true,
            emailRedirectTo: `${window.location.origin}${redirectPath}`,
          },
        });
        if (error) throw new Error(error.message);
        return { ok: true };
      },

      // Google OAuth. Redirects away to Google consent screen.
      async signInWithGoogle(redirectPath = '/account') {
        if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}${redirectPath}`,
            queryParams: { prompt: 'select_account' },
          },
        });
        if (error) throw new Error(error.message);
        return { ok: true };
      },

      async signOut() {
        if (!isSupabaseConfigured) return;
        await supabase.auth.signOut();
      },
    };
  }, [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

// Back-compat: existing AdminContext consumers (AdminGuard, AdminLayout,
// AdminLogin) call useAdmin(). Keep the name working as an alias so those
// don't need to be touched.
export const useAdmin = useAuth;
