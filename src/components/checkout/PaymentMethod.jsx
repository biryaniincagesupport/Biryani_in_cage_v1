import { CheckCircle2, Smartphone, Wallet, Lock } from 'lucide-react';

// Two-option payment method block. Online is disabled — we render it
// with a "Coming soon" tag so users see we're working on it.

export default function PaymentMethod({ value = 'cod', onChange }) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => onChange('cod')}
        className={`w-full rounded-2xl border p-5 text-left transition ${
          value === 'cod'
            ? 'border-saffron-400/60 bg-saffron-400/5 shadow-neon-soft'
            : 'border-saffron-400/15 bg-ink-900/60 hover:border-saffron-400/30'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-saffron-400/30 bg-saffron-400/10 text-saffron-300">
            <Wallet size={18} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-display text-base text-bone">Pay on Delivery</p>
              {value === 'cod' && (
                <CheckCircle2 size={16} className="text-saffron-300" />
              )}
            </div>
            <p className="mt-1 text-xs text-bone/65 leading-relaxed">
              Cash <span className="text-bone/45">or</span> scan our UPI QR at the door.
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <Pill>BHIM UPI</Pill>
              <Pill>PhonePe</Pill>
              <Pill>Paytm</Pill>
              <Pill>Google Pay</Pill>
              <Pill>Cash</Pill>
            </div>
          </div>
        </div>
      </button>

      <div className="relative w-full overflow-hidden rounded-2xl border border-saffron-400/10 bg-ink-900/40 p-5 opacity-60">
        <div className="flex items-start gap-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-saffron-400/20 bg-ink-800 text-bone/50">
            <Smartphone size={18} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-display text-base text-bone/75">Online Payment</p>
              <span className="inline-flex items-center gap-1 rounded-full border border-saffron-400/20 px-2 py-0.5 text-[9px] uppercase tracking-[0.25em] text-saffron-300">
                <Lock size={9} /> Coming soon
              </span>
            </div>
            <p className="mt-1 text-xs text-bone/55 leading-relaxed">
              Cards, Net Banking, UPI Intent — wiring up shortly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="rounded-full border border-saffron-400/20 bg-ink-900/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-saffron-200/85">
      {children}
    </span>
  );
}
