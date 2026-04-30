// ─────────────────────────────────────────────────────────────────────────
// Order ticket → admin WhatsApp via wa.me deep-link.
// Customer's tap opens WhatsApp pre-addressed to the admin number with
// the structured order text pre-filled. No API key, no infrastructure.
//
// Plain-text ticket: no emojis (some Android keyboards / older WhatsApp
// builds render unknown glyphs as "?"), only the *bold* markdown
// markers WhatsApp natively supports.
// ─────────────────────────────────────────────────────────────────────────

import { SITE } from '@/data/site';

const pad2 = (n) => String(n).padStart(2, '0');

function formatTimestamp(date = new Date()) {
  const d = pad2(date.getDate());
  const M = date.toLocaleString('en-IN', { month: 'short' });
  const Y = date.getFullYear();
  let h = date.getHours();
  const m = pad2(date.getMinutes());
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${pad2(h)}:${m} ${ampm}, ${d} ${M} ${Y}`;
}

const rupee = (n) => `₹${n.toLocaleString('en-IN')}`;

export function formatOrderMessage({ order, items, totals, orderId }) {
  const lines = [];

  lines.push('*NEW ORDER -- Biryani In Cage*');
  lines.push('----------------------------------------');
  if (orderId) lines.push(`Ref: ${orderId}`);
  lines.push('');

  lines.push('*Customer*');
  lines.push(order.name);
  lines.push(order.phone);
  if (order.email) lines.push(order.email);
  lines.push('');

  lines.push('*Delivery Address*');
  lines.push(order.address.line1);
  if (order.address.landmark) lines.push(`Landmark: ${order.address.landmark}`);
  if (order.address.area) lines.push(order.address.area);
  lines.push(`PIN ${order.address.pincode}`);
  lines.push('');

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  lines.push(`*Items (${itemCount})*`);
  items.forEach((i) => {
    lines.push(`- ${i.name} x ${i.quantity}  ${rupee(i.price * i.quantity)}`);
  });
  lines.push('');

  lines.push('*Bill*');
  lines.push(`Subtotal: ${rupee(totals.subtotal)}`);
  lines.push(
    totals.deliveryFee > 0
      ? `Delivery: ${rupee(totals.deliveryFee)}`
      : 'Delivery: FREE',
  );
  if (totals.gst > 0) lines.push(`GST: ${rupee(totals.gst)}`);
  lines.push(`*Total: ${rupee(totals.total)}*`);
  lines.push('');

  lines.push(
    `Payment: ${
      order.paymentMethod === 'cod'
        ? 'Cash / UPI on Delivery'
        : order.paymentMethod
    }`,
  );

  if (order.specialInstructions) {
    lines.push('');
    lines.push('*Notes*');
    lines.push(order.specialInstructions);
  }

  lines.push('');
  lines.push(`Placed at ${formatTimestamp()}`);
  lines.push('Order placed via website');

  return lines.join('\n');
}

export function buildWhatsappLink({ order, items, totals, orderId, phoneOverride }) {
  const number = (phoneOverride || SITE.adminWhatsapp).replace(/\D/g, '');
  const message = formatOrderMessage({ order, items, totals, orderId });
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

// Open WhatsApp in a new tab. Returns the link so the caller can show a
// fallback button if the popup gets blocked. Call this synchronously
// inside a user-gesture handler (e.g. form submit) — browsers grant the
// popup permission only during user interaction.
export function openWhatsappTicket(args) {
  const link = buildWhatsappLink(args);
  let opened = null;
  if (typeof window !== 'undefined') {
    try {
      opened = window.open(link, '_blank', 'noopener,noreferrer');
    } catch {
      /* popup blocked — caller will surface the fallback */
    }
  }
  return { link, opened: !!opened };
}
