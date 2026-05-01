import { useState } from 'react';
import { ChevronDown, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ORDER_STATUSES, STATUS_LABELS, updateOrderStatus } from '@/api/admin';
import StatusBadge from './StatusBadge';

// Inline dropdown to flip an order's status. Optimistic update with
// rollback on error.

export default function StatusUpdater({ order, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const change = async (next) => {
    if (next === order.status) {
      setOpen(false);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const updated = await updateOrderStatus(order.id, next);
      onUpdated?.(updated);
    } catch (e) {
      setError(e.message || 'Could not update');
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={busy}
        className="inline-flex items-center gap-1.5 disabled:opacity-50"
      >
        <StatusBadge status={order.status} />
        {busy ? (
          <Loader2 size={11} className="animate-spin text-saffron-300" />
        ) : (
          <ChevronDown size={11} className="text-bone/40" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-2xl border border-saffron-400/20 bg-ink-900 p-1 shadow-plate"
          >
            {ORDER_STATUSES.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => change(s)}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs transition hover:bg-saffron-400/10 ${
                    s === order.status ? 'text-saffron-300' : 'text-bone/85'
                  }`}
                >
                  <span className="font-display uppercase tracking-[0.2em]">
                    {STATUS_LABELS[s]}
                  </span>
                  {s === order.status && <Check size={12} className="text-saffron-300" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {error && (
        <p className="absolute right-0 top-full mt-1 text-[10px] text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
