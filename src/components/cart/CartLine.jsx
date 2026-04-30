import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import VegBadge from '@/components/ui/VegBadge';
import QuantityStepper from './QuantityStepper';
import { useCart } from '@/state/CartContext';
import { fmt } from '@/utils/cart';

// Single row inside the cart drawer.
export default function CartLine({ item }) {
  const { remove } = useCart();

  // Synthetic "menu item" shape for the stepper — it only needs id, name,
  // veg, price, plus the variant if any.
  const stepperItem = {
    id: item.itemId,
    name: item.name.replace(/\s*\([^)]*\)$/, ''), // strip trailing "(Half)" / "(Full)"
    price: item.price,
    veg: item.veg,
  };
  const stepperVariant = item.variant
    ? { id: item.variant, label: item.variantLabel ?? item.variant, price: item.price }
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-3 rounded-2xl border border-saffron-400/10 bg-ink-900/60 p-4"
    >
      <div className="mt-1">
        <VegBadge veg={item.veg} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-bone">{item.name}</p>
        <p className="mt-0.5 text-xs text-bone/55">
          {fmt(item.price)} × {item.quantity} = <span className="text-saffron-300">{fmt(item.price * item.quantity)}</span>
        </p>

        <div className="mt-3 flex items-center gap-3">
          <QuantityStepper item={stepperItem} variant={stepperVariant} />
          <button
            type="button"
            onClick={() => remove(item.key)}
            aria-label="Remove from cart"
            className="text-bone/40 transition hover:text-red-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
