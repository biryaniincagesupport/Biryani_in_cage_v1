import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/state/CartContext';
import { cartKey } from '@/utils/cart';

// Two states:
//   qty === 0  → "Add" button (single tap to start)
//   qty >= 1   → −/n/+ stepper
// Variant is optional; pass when the menu item has half/full prices.

export default function QuantityStepper({ item, variant, size = 'sm', label }) {
  const { addItem, decrement, getQuantity } = useCart();
  const key = cartKey(item.id, variant?.id);
  const qty = getQuantity(key);

  const onAdd = () => {
    addItem({
      key,
      itemId: item.id,
      name: variant ? `${item.name} (${variant.label})` : item.name,
      price: variant ? variant.price : item.price,
      variant: variant?.id ?? null,
      variantLabel: variant?.label ?? null,
      veg: item.veg,
    });
  };

  const onDec = () => decrement(key);

  // Sizing presets
  const dim =
    size === 'lg'
      ? { px: 'px-5', py: 'py-2', text: 'text-sm', icon: 14, h: 'h-9 w-9' }
      : { px: 'px-4', py: 'py-1.5', text: 'text-xs', icon: 12, h: 'h-7 w-7' };

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={onAdd}
        className={`group inline-flex items-center gap-1.5 rounded-full bg-saffron-400 ${dim.px} ${dim.py} font-display ${dim.text} font-bold uppercase tracking-[0.2em] text-ink-950 shadow-neon-soft transition hover:bg-saffron-300 hover:shadow-neon`}
      >
        {label || 'Add'}
        <Plus size={dim.icon} strokeWidth={3} className="transition-transform group-hover:rotate-90" />
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-saffron-400/50 bg-ink-900/80 p-1 shadow-neon-soft">
      <button
        type="button"
        onClick={onDec}
        aria-label="Remove one"
        className={`${dim.h} grid place-items-center rounded-full text-saffron-300 transition hover:bg-saffron-400/15`}
      >
        <Minus size={dim.icon} strokeWidth={2.5} />
      </button>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={qty}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className={`min-w-[22px] text-center font-display ${dim.text} font-bold text-saffron-200`}
        >
          {qty}
        </motion.span>
      </AnimatePresence>
      <button
        type="button"
        onClick={onAdd}
        aria-label="Add one"
        className={`${dim.h} grid place-items-center rounded-full text-saffron-300 transition hover:bg-saffron-400/15`}
      >
        <Plus size={dim.icon} strokeWidth={2.5} />
      </button>
    </div>
  );
}
