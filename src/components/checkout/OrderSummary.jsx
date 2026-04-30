import { useCart } from '@/state/CartContext';
import { computeTotals, fmt } from '@/utils/cart';
import VegBadge from '@/components/ui/VegBadge';
import { ShieldCheck } from 'lucide-react';

// Right-rail order summary on the Checkout page.
export default function OrderSummary() {
  const { items } = useCart();
  const totals = computeTotals(items);

  return (
    <aside className="glass-card sticky top-[88px] flex flex-col gap-5 p-6">
      <div>
        <p className="section-eyebrow">Order summary</p>
        <h2 className="mt-2 font-display text-2xl text-bone">Your cart</h2>
      </div>

      <ul className="space-y-2.5 text-sm">
        {items.map((it) => (
          <li key={it.key} className="flex items-start gap-2">
            <div className="mt-1">
              <VegBadge veg={it.veg} />
            </div>
            <div className="flex-1 leading-tight">
              <p className="text-bone">{it.name}</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-bone/50">
                {fmt(it.price)} × {it.quantity}
              </p>
            </div>
            <span className="font-display text-saffron-200">
              {fmt(it.price * it.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="space-y-2 border-t border-saffron-400/10 pt-4 text-sm">
        <Row label="Subtotal" value={fmt(totals.subtotal)} />
        <Row
          label="Delivery"
          value={
            totals.deliveryFee === 0 ? (
              <span className="text-emerald-300">FREE</span>
            ) : (
              fmt(totals.deliveryFee)
            )
          }
        />
        {totals.gst > 0 && <Row label="GST (5%)" value={fmt(totals.gst)} />}
      </div>

      <div className="flex items-center justify-between border-t border-saffron-400/10 pt-4">
        <span className="font-display text-lg text-bone">Total</span>
        <span className="font-display text-3xl neon-text">{fmt(totals.total)}</span>
      </div>

      <div className="rounded-2xl border border-saffron-400/15 bg-ink-900/50 p-4">
        <div className="flex items-center gap-2 text-saffron-300">
          <ShieldCheck size={14} />
          <span className="text-[11px] uppercase tracking-[0.25em]">Pay on delivery</span>
        </div>
        <p className="mt-2 text-xs text-bone/65 leading-relaxed">
          Cash, or scan our UPI QR — BHIM, PhonePe, Paytm, Google Pay all
          welcome. Our delivery person carries the QR.
        </p>
      </div>
    </aside>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-bone/65">{label}</span>
      <span className="font-medium text-bone">{value}</span>
    </div>
  );
}
