import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/state/CartContext';
import { computeTotals, fmt, itemsLabel } from '@/utils/cart';

// Floating cart button. Auto-hides on /checkout (the page already has the
// summary inline) and when the cart is empty.

export default function CartFab({ onOpen }) {
  const { items, itemCount, isEmpty } = useCart();
  const { pathname } = useLocation();
  const totals = computeTotals(items);

  const hidden = isEmpty || pathname.startsWith('/checkout');

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.button
          type="button"
          onClick={onOpen}
          initial={{ y: 80, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          aria-label={`Open cart with ${itemsLabel(itemCount)}, total ${fmt(totals.total)}`}
          className="group fixed bottom-[88px] left-3 z-30 inline-flex items-center gap-3 rounded-full bg-saffron-400 py-3 pl-4 pr-5 font-bold text-ink-950 shadow-neon transition hover:bg-saffron-300 md:bottom-6 md:left-6"
        >
          <span className="relative grid h-9 w-9 place-items-center rounded-full bg-ink-950 text-saffron-300">
            <ShoppingBag size={16} />
            <motion.span
              key={itemCount}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 18 }}
              className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-ember-500 text-[10px] font-display text-white ring-2 ring-saffron-400"
            >
              {itemCount}
            </motion.span>
          </span>
          <span className="flex flex-col items-start leading-none">
            <span className="text-[10px] uppercase tracking-[0.25em] opacity-75">
              {itemsLabel(itemCount)}
            </span>
            <span className="mt-1 font-display text-base">
              {fmt(totals.total)} · View cart →
            </span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
