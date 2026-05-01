import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';

const blank = {
  label:    '',
  line1:    '',
  landmark: '',
  area:     '',
  pincode:  '',
  is_default: false,
};

export default function AddressForm({ initial, onSubmit, onCancel, busy }) {
  const [form, setForm] = useState(() => ({ ...blank, ...(initial ?? {}) }));
  const [errors, setErrors] = useState({});

  const set = (patch) => {
    setForm((f) => ({ ...f, ...patch }));
    if (Object.keys(errors).length) setErrors({});
  };

  const submit = (e) => {
    e.preventDefault();
    const eMap = {};
    if (!form.line1.trim()) eMap.line1 = 'Required.';
    if (!/^\d{6}$/.test(form.pincode.trim())) eMap.pincode = '6-digit PIN.';
    if (Object.keys(eMap).length) {
      setErrors(eMap);
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-saffron-400/15 bg-ink-900/60 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Label">
          <input
            value={form.label}
            onChange={(e) => set({ label: e.target.value })}
            placeholder="Home / Office"
            className={inputCls()}
          />
        </Field>
        <Field label="PIN code *" error={errors.pincode}>
          <input
            inputMode="numeric"
            value={form.pincode}
            onChange={(e) => set({ pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
            placeholder="814112"
            className={inputCls(errors.pincode)}
          />
        </Field>
        <Field label="House / Building / Street *" className="sm:col-span-2" error={errors.line1}>
          <input
            value={form.line1}
            onChange={(e) => set({ line1: e.target.value })}
            placeholder="Plot 42, Hira Lodge, Tower Chowk"
            className={inputCls(errors.line1)}
          />
        </Field>
        <Field label="Landmark">
          <input
            value={form.landmark}
            onChange={(e) => set({ landmark: e.target.value })}
            placeholder="Opposite Reliance Trends"
            className={inputCls()}
          />
        </Field>
        <Field label="Area">
          <input
            value={form.area}
            onChange={(e) => set({ area: e.target.value })}
            placeholder="Bompass Town"
            className={inputCls()}
          />
        </Field>
      </div>

      <label className="inline-flex cursor-pointer items-center gap-2 text-xs uppercase tracking-[0.2em] text-bone/65">
        <input
          type="checkbox"
          checked={form.is_default}
          onChange={(e) => set({ is_default: e.target.checked })}
          className="h-3.5 w-3.5 accent-saffron-400"
        />
        Set as default
      </label>

      <div className="flex flex-wrap gap-3 pt-1">
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Save size={14} /> Save address
            </>
          )}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
        )}
      </div>
    </form>
  );
}

const inputCls = (error) =>
  `w-full rounded-xl border bg-ink-900/70 px-4 py-2.5 text-sm text-bone placeholder:text-bone/40 outline-none transition ${
    error
      ? 'border-red-400/60 focus:border-red-400'
      : 'border-saffron-400/20 focus:border-saffron-400/60 focus:shadow-neon-soft'
  }`;

function Field({ label, children, className = '', error }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-saffron-400/80">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-[11px] text-red-300">{error}</span>}
    </label>
  );
}
