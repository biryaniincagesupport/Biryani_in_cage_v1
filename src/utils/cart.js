// Cart math + key helpers. Centralised so totals are always computed the
// same way in Drawer, Checkout, and orderService.

export const DELIVERY_FEE = 20;             // flat ₹ — change here if needed
export const FREE_DELIVERY_THRESHOLD = 599;  // free delivery above this subtotal
export const GST_RATE = 0;                   // GST disabled — flip to 0.05 when ready

// Unique key per cart line. Half/full of the same dish are separate lines.
export const cartKey = (itemId, variant) =>
  variant ? `${itemId}:${variant}` : `${itemId}`;

export function computeTotals(items) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee =
    items.length === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + deliveryFee + gst;
  return { subtotal, deliveryFee, gst, total };
}

// Pretty-print a price as "₹120"
export const fmt = (n) => `₹${n}`;

// "5 items" / "1 item"
export const itemsLabel = (n) => `${n} ${n === 1 ? 'item' : 'items'}`;
