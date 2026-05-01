import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/state/AuthContext';

// Re-usable sign-in modal. Two paths: Google (one tap, redirects away
// then back) and Magic-Link (sends an email).
//
// Use:
//   const [open, setOpen] = useState(false);
//   <AuthModal open={open} onClose={() => setOpen(false)}
//              redirectPath="/checkout" />

const GoogleG = (props) => (
  <svg viewBox="0 0 48 48" {...props}>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5Z"/>
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6 29 4 24 4 16.3 4 9.6 8.3 6.3 14.7Z"/>
    <path fill="#4CAF50" d="M24 44c5 0 9.5-1.9 12.9-5l-5.9-5C28.9 35.5 26.6 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44Z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l5.9 5C40.3 35.7 44 30.3 44 24c0-1.3-.1-2.4-.4-3.5Z"/>
  </svg>
);

export default function AuthModal({
  open,
  onClose,
  redirectPath = '/account',
  title = 'Sign in to Biryani In Cage',
  subtitle = "Order faster, see history, save your addresses.",
}) {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setPhase('idle');
      setError('');
    }
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const onGoogle = async () => {
    setPhase('google');
    setError('');
    try {
      await auth.signInWithGoogle(redirectPath);
      // Page is redirecting; nothing else to do.
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
      setPhase('error');
    }
  };

  const onEmail = async (e) => {
    e.preventDefault();
    setPhase('sending');
    setError('');
    try {
      await auth.signInWithEmail(email.trim(), redirectPath);
      setPhase('sent');
    } catch (err) {
      setError(err.message || 'Could not send the magic link.');
      setPhase('error');
    }
  };

  if (!auth.configured) {
    return (
      <SimpleSheet open={open} onClose={onClose}>
        <p className="section-eyebrow">Sign in unavailable</p>
        <h2 className="mt-2 font-display text-2xl text-bone">
          <em className="not-italic neon-text">Connect Supabase</em> to enable accounts.
        </h2>
        <p className="mt-4 text-sm text-bone/65">
          Without Supabase, customers can still place orders as guests — but
          history, saved addresses, and Google sign-in won't work yet.
        </p>
      </SimpleSheet>
    );
  }

  return (
    <SimpleSheet open={open} onClose={onClose}>
      <div>
        <p className="section-eyebrow">Sign in</p>
        <h2 className="mt-2 font-display text-2xl text-bone sm:text-3xl">{title}</h2>
        <p className="mt-3 text-sm text-bone/65">{subtitle}</p>
      </div>

      {phase === 'sent' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" />
            <div>
              <p className="font-display text-bone">Check your inbox.</p>
              <p className="mt-1 text-sm text-bone/65">
                We sent a sign-in link to <strong className="text-bone">{email}</strong>.
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          <button
            type="button"
            onClick={onGoogle}
            disabled={phase === 'google'}
            className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full border border-bone/15 bg-white px-5 py-3.5 text-sm font-bold text-ink-950 transition hover:bg-bone disabled:opacity-60"
          >
            {phase === 'google' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <GoogleG className="h-4 w-4" />
            )}
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-saffron-400/15" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-bone/45">or</span>
            <span className="h-px flex-1 bg-saffron-400/15" />
          </div>

          <form onSubmit={onEmail} className="space-y-3">
            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-saffron-400/80">
                Email
              </span>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-saffron-400/70" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-saffron-400/20 bg-ink-900/70 py-3 pl-10 pr-4 text-sm text-bone placeholder:text-bone/40 outline-none transition focus:border-saffron-400/60 focus:shadow-neon-soft"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={phase === 'sending'}
              className="btn-ghost w-full disabled:opacity-60"
            >
              {phase === 'sending' ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Sending magic link…
                </>
              ) : (
                <>Email me a sign-in link</>
              )}
            </button>
          </form>

          {phase === 'error' && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-xs text-red-200">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </>
      )}

      <p className="mt-6 text-center text-[10px] uppercase tracking-[0.25em] text-bone/40">
        Sign-in is optional · guest checkout always works
      </p>
    </SimpleSheet>
  );
}

function SimpleSheet({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-ink-950/80 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 z-[71] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="glass-card relative p-7 sm:p-9">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-full border border-saffron-400/20 bg-ink-900 p-1.5 text-bone/60 transition hover:text-bone"
              >
                <X size={14} />
              </button>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
