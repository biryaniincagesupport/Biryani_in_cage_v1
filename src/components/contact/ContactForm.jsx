import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import { submitEnquiry } from '@/api/enquiries';

const OCCASIONS = [
  { id: 'general', label: 'General' },
  { id: 'reservation', label: 'Table reservation' },
  { id: 'bulk', label: 'Bulk order' },
  { id: 'catering', label: 'Party / Catering' },
];

const initial = { name: '', phone: '', email: '', message: '', occasion: 'general' };

export default function ContactForm() {
  const [form, setForm] = useState(initial);
  const [state, setState] = useState({ status: 'idle', message: '' });

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ status: 'loading', message: '' });
    try {
      const res = await submitEnquiry(form);
      setState({
        status: 'success',
        message: res.mock
          ? "Got it. We'll reach out soon. (dev mode)"
          : "Thanks! We'll call you shortly.",
      });
      setForm(initial);
    } catch (err) {
      setState({ status: 'error', message: err.message || 'Something went wrong.' });
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="glass-card relative overflow-hidden p-7 sm:p-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name *">
          <input
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="Mayank"
            required
            className={inputCls}
          />
        </Field>
        <Field label="Phone *">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set({ phone: e.target.value })}
            placeholder="+91 XXXXX XXXXX"
            required
            className={inputCls}
          />
        </Field>
        <Field label="Email" className="sm:col-span-2">
          <input
            type="email"
            value={form.email}
            onChange={(e) => set({ email: e.target.value })}
            placeholder="you@example.com"
            className={inputCls}
          />
        </Field>
        <Field label="Reason for getting in touch" className="sm:col-span-2">
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => set({ occasion: o.id })}
                className={`rounded-full border px-3.5 py-1.5 text-xs uppercase tracking-[0.2em] transition ${
                  form.occasion === o.id
                    ? 'border-saffron-400 bg-saffron-400 text-ink-950'
                    : 'border-saffron-400/20 bg-ink-900/60 text-bone/70 hover:text-bone'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Anything else" className="sm:col-span-2">
          <textarea
            value={form.message}
            onChange={(e) => set({ message: e.target.value })}
            placeholder="Date, headcount, dietary preferences…"
            rows={4}
            className={`${inputCls} resize-none`}
          />
        </Field>
      </div>

      <div className="mt-7 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-xs text-bone/55">
          We'll only use this to call you back. No spam, no newsletters.
        </p>
        <button
          type="submit"
          disabled={state.status === 'loading'}
          className="btn-primary !px-7 disabled:opacity-60"
        >
          {state.status === 'loading' ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Send size={15} /> Send enquiry
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {state.status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
          >
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <span>{state.message}</span>
          </motion.div>
        )}
        {state.status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{state.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

const inputCls =
  'w-full rounded-xl border border-saffron-400/20 bg-ink-900/70 px-4 py-3 text-sm text-bone placeholder:text-bone/40 outline-none transition focus:border-saffron-400/60 focus:shadow-neon-soft';

function Field({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-saffron-400/80">
        {label}
      </span>
      {children}
    </label>
  );
}
