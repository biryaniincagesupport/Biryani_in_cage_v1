import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Loader2, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth as useAdmin } from '@/state/AuthContext';
import CageBars from '@/components/ui/CageBars';

export default function AdminLogin() {
  const admin = useAdmin();
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  useEffect(() => {
    if (admin.email) setEmail(admin.email);
  }, [admin.email]);

  if (!admin.configured) {
    return <ConfigurePrompt />;
  }
  if (admin.isAuthed && admin.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setPhase('sending');
    setError('');
    try {
      await admin.sendMagicLink(email.trim());
      setPhase('sent');
    } catch (err) {
      setError(err.message || 'Could not send the magic link.');
      setPhase('error');
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-20">
      <div className="absolute inset-0">
        <img
          src="/photos/cage-bars-detail.jpg"
          alt=""
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 to-ink-950" />
      </div>
      <CageBars count={10} className="opacity-30" splitFromCenter={false} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card relative w-full max-w-md p-9"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-bone/50 hover:text-saffron-300"
        >
          <ArrowLeft size={11} /> Back to site
        </Link>

        <div className="mt-6">
          <p className="section-eyebrow">Admin</p>
          <h1 className="mt-2 font-display text-3xl text-bone sm:text-4xl">
            Welcome back, <em className="not-italic neon-text">boss</em>.
          </h1>
          <p className="mt-3 text-sm text-bone/65 leading-relaxed">
            We'll email you a one-tap sign-in link. No password to remember.
          </p>
        </div>

        {phase === 'sent' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5"
          >
            <div className="flex items-start gap-3">
              <ShieldCheck size={18} className="mt-0.5 text-emerald-300" />
              <div>
                <p className="font-display text-base text-bone">Check your inbox.</p>
                <p className="mt-1 text-sm text-bone/65">
                  We sent a magic link to <strong className="text-bone">{email}</strong>.
                  Tap it to sign in.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-saffron-400/80">
                Admin email
              </span>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-saffron-400/70"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@biryaniincage.in"
                  className="w-full rounded-xl border border-saffron-400/20 bg-ink-900/70 py-3 pl-10 pr-4 text-sm text-bone placeholder:text-bone/40 outline-none transition focus:border-saffron-400/60 focus:shadow-neon-soft"
                />
              </div>
            </label>

            {phase === 'error' && (
              <div className="flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-xs text-red-200">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={phase === 'sending'}
              className="btn-primary w-full !py-3.5 disabled:opacity-60"
            >
              {phase === 'sending' ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Sending magic link…
                </>
              ) : (
                <>Send magic link</>
              )}
            </button>
          </form>
        )}

        {admin.adminEmails.length > 0 && (
          <p className="mt-6 text-center text-[10px] uppercase tracking-[0.25em] text-bone/35">
            Allowlisted: {admin.adminEmails.join(', ')}
          </p>
        )}
      </motion.div>
    </main>
  );
}

function ConfigurePrompt() {
  return (
    <main className="container-x flex min-h-screen items-center justify-center pt-[88px]">
      <div className="glass-card max-w-lg p-9 text-center">
        <p className="section-eyebrow">Admin</p>
        <h1 className="mt-3 font-display text-3xl text-bone">
          Connect <em className="not-italic neon-text">Supabase</em> first.
        </h1>
        <p className="mt-4 text-sm text-bone/65 leading-relaxed">
          The admin dashboard reads orders from your Supabase project. Add{' '}
          <code className="rounded bg-ink-800 px-1.5 py-0.5 text-xs text-saffron-200">
            VITE_SUPABASE_URL
          </code>{' '}
          and{' '}
          <code className="rounded bg-ink-800 px-1.5 py-0.5 text-xs text-saffron-200">
            VITE_SUPABASE_ANON_KEY
          </code>{' '}
          to your <code>.env</code>, run the SQL in{' '}
          <code className="rounded bg-ink-800 px-1.5 py-0.5 text-xs text-saffron-200">
            supabase/schema.sql
          </code>
          , then come back.
        </p>
        <Link to="/" className="btn-ghost mt-7 inline-flex">Back to site</Link>
      </div>
    </main>
  );
}
