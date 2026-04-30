import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/state/CartContext';
import { computeTotals, fmt, FREE_DELIVERY_THRESHOLD } from '@/utils/cart';
import CartLine from './CartLine';
import { useEffect } from 'react';

// Slide-in cart drawer. Mounted at the App level so it can be opened from
// the Fab, the menu page, or anywhere else.

export default function CartDrawer({ open, onClose }) {
  const { items, isEmpty, clear } = useCart();
  const totals = computeTotals(items);

  // Lock background scroll while open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-ink-950/75 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col border-l border-saffron-400/20 bg-ink-950 shadow-2xl"
            role="dialog"
            aria-label="Shopping cart"
          >
            <header className="flex items-center justify-between border-b border-saffron-400/10 p-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-saffron-400/70">
                  Your order
                </p>
                <h2 className="mt-1 font-display text-2xl text-bone">Cart</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="rounded-full border border-saffron-400/20 bg-ink-900 p-2 text-bone/70 transition hover:border-saffron-400/50 hover:text-bone"
              >
                <X size={16} />
              </button>
            </header>

            {isEmpty ? (
              <EmptyCart onClose={onClose} />
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-5">
                  <DeliveryNudge subtotal={totals.subtotal} />

                  <AnimatePresence initial={false}>
                    <div className="space-y-3">
                      {items.map((it) => (
                        <CartLine key={it.key} item={it} />
                      ))}
                    </div>
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={clear}
                    className="mt-6 text-xs uppercase tracking-[0.2em] text-bone/40 underline-offset-4 hover:text-bone/70 hover:underline"
                  >
                    Clear cart
                  </button>
                </div>

                <footer className="space-y-2 border-t border-saffron-400/10 bg-ink-900/40 p-5">
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
                  <div className="flex items-center justify-between border-t border-saffron-400/10 pt-3">
                    <span className="font-display text-lg text-bone">Total</span>
                    <span className="font-display text-3xl neon-text">
                      {fmt(totals.total)}
                    </span>
                  </div>
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="btn-primary !mt-3 w-full !py-3.5"
                  >
                    Continue to checkout <ArrowRight size={15} />
                  </Link>
                  <p className="text-center text-[10px] uppercase tracking-[0.25em] text-bone/40">
                    Cash or UPI accepted at delivery
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-bone/65">{label}</span>
      <span className="font-medium text-bone">{value}</span>
    </div>
  );
}

function DeliveryNudge({ subtotal }) {
  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;
  if (remaining <= 0) {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/5 px-4 py-3 text-xs text-emerald-200">
        <Truck size={14} />
        Free delivery unlocked. Nice.
      </div>
    );
  }
  return (
    <div className="mb-4 flex items-center gap-2 rounded-2xl border border-saffron-400/20 bg-saffron-400/5 px-4 py-3 text-xs text-saffron-200">
      <Truck size={14} />
      Add <span className="font-bold">{fmt(remaining)}</span> more for free delivery.
    </div>
  );
}

function EmptyCart({ onClose }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full border border-saffron-400/30 bg-ink-900 text-saffron-300">
        <ShoppingBag size={20} />
      </div>
      <p className="font-display text-2xl text-bone">Cart's empty.</p>
      <p className="text-sm text-bone/60">
        The biryani isn't ordering itself. Yet.
      </p>
      <Link to="/menu" onClick={onClose} className="btn-primary mt-2">
        See the menu
      </Link>
    </div>
  );
}
