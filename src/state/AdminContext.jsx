import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

// ─────────────────────────────────────────────────────────────────────────
// Admin auth state. Wraps Supabase Auth (magic-link / OTP) and exposes
// isAdmin (email is in the allowlist), session, and login helpers.
//
// Two-layer guard:
//   1. Front-end: this context decides whether to render the dashboard.
//   2. Back-end (RLS): public.is_admin() in schema.sql is the real
//      authority — it gates SELECT/UPDATE on orders.
// ─────────────────────────────────────────────────────────────────────────

const AdminContext = createContext(null);

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isAdminEmail(email) {
  if (!email) return false;
  // If the env list isn't configured, defer to RLS — assume any signed-in
  // user could be admin and let the database reject if not.
  if (ADMIN_EMAILS.length === 0) return true;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function AdminProvider({ children }) {
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
    const email = session?.user?.email ?? null;
    return {
      configured: isSupabaseConfigured,
      loading,
      session,
      email,
      isAuthed: !!session,
      isAdmin: !!session && isAdminEmail(email),
      adminEmails: ADMIN_EMAILS,

      async sendMagicLink(targetEmail) {
        if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
        const { error } = await supabase.auth.signInWithOtp({
          email: targetEmail,
          options: {
            shouldCreateUser: true,
            emailRedirectTo: `${window.location.origin}/admin`,
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

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside <AdminProvider>');
  return ctx;
}
