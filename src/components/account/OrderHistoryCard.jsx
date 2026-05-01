import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RotateCcw, AlertCircle } from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';
import { fmt } from '@/utils/cart';

// Single past-order card on the Account page. Click to expand items.
// "Reorder" lifts items into the cart (caller decides what happens after).

export default function OrderHistoryCard({ order, onReorder }) {
  const [open, setOpen] = useState(false);
  const [reorderState, setReorderState] = useState(null);
  // reorderState shape: null | { busy: true } | { unavailable: [...] }

  const placedAt = new Date(order.created_at);
  const itemCount = (order.items ?? []).reduce((s, i) => s + (i.quantity ?? 0), 0);

  const handleReorder = async (e) => {
    e.stopPropagation();
    setReorderState({ busy: true });
    const res = await onReorder(order);
    if (res?.unavailable?.length) {
      setReorderState({ unavailable: res.unavailable });
    } else {
      setReorderState(null);
    }
  };

  return (
    <article className="rounded-3xl border border-saffron-400/15 bg-ink-900/60 transition hover:border-saffron-400/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <ChevronRight
          size={14}
          className={`text-bone/40 transition-transform ${open ? 'rotate-90' : ''}`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <p className="truncate font-medium text-bone">
              {placedAt.toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
            <StatusBadge status={order.status} size="sm" />
          </div>
          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-bone/50">
            {itemCount} items · #{order.id}
          </p>
        </div>
        <span className="hidden font-display text-base text-saffron-200 sm:inline">
          {fmt(order.total)}
        </span>
        <span onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleReorder}
            disabled={reorderState?.busy}
            className="inline-flex items-center gap-1.5 rounded-full border border-saffron-400/30 bg-saffron-400/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-saffron-200 transition hover:border-saffron-400 hover:text-saffron-100 disabled:opacity-50"
          >
            <RotateCcw size={11} /> Reorder
          </button>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-saffron-400/10"
          >
            <div className="space-y-4 p-5 text-sm">
              <ul className="space-y-1.5">
                {(order.items ?? []).map((it, i) => (
                  <li key={i} className="flex items-baseline justify-between text-bone/85">
                    <span className="truncate">
                      <span className="text-bone/50">×{it.quantity}</span> {it.name}
                    </span>
                    <span className="font-display text-saffron-200">
                      {fmt(it.line_total ?? it.unit_price * it.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="space-y-1 border-t border-saffron-400/10 pt-3 text-sm">
                <Row label="Subtotal" value={fmt(order.subtotal)} />
                <Row label="Delivery" value={order.delivery_fee > 0 ? fmt(order.delivery_fee) : 'FREE'} />
                {order.gst_amount > 0 && <Row label="GST" value={fmt(order.gst_amount)} />}
                <Row label="Total" value={fmt(order.total)} bold />
              </div>

              {order.delivery_address && (
                <p className="text-xs text-bone/55">
                  Delivered to: {order.delivery_address.line1}
                  {order.delivery_address.area ? `, ${order.delivery_address.area}` : ''} —
                  PIN {order.delivery_address.pincode}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {reorderState?.unavailable?.length > 0 && (
        <div className="m-4 mt-0 flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-xs text-amber-200">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>
            Some items aren't on the menu anymore — {reorderState.unavailable.map((u) => u.name).join(', ')}.
            We added the rest to your cart.
          </span>
        </div>
      )}
    </article>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex items-baseline justify-between ${bold ? 'border-t border-saffron-400/10 pt-2 text-bone' : 'text-bone/65'}`}>
      <span>{label}</span>
      <span className={bold ? 'font-display text-base text-saffron-300' : 'font-medium'}>
        {value}
      </span>
    </div>
  );
}
