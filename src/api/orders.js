import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

// Persist a new order. When Supabase isn't configured, returns a mock
// order ID so the UI can still walk through to success. Same pattern
// as enquiries.js — keeps the site demo-able with no backend.

const genFallbackId = () =>
  `BIC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

export async function placeOrder(payload) {
  const order = {
    customer_name: payload.name,
    customer_phone: payload.phone,
    customer_email: payload.email || null,
    delivery_address: {
      line1:    payload.line1,
      landmark: payload.landmark || null,
      area:     payload.area || null,
      pincode:  payload.pincode,
    },
    items: payload.items.map((i) => ({
      menu_id:    i.itemId,
      name:       i.name,
      variant:    i.variant,
      quantity:   i.quantity,
      unit_price: i.price,
      line_total: i.price * i.quantity,
    })),
    subtotal:             payload.totals.subtotal,
    delivery_fee:         payload.totals.deliveryFee,
    gst_amount:           payload.totals.gst,
    total:                payload.totals.total,
    payment_method:       'cod',
    status:               'pending',
    special_instructions: payload.specialInstructions || null,
  };

  if (!isSupabaseConfigured) {
    console.info('[orders] Supabase not configured — payload:', order);
    await new Promise((r) => setTimeout(r, 800));
    return { ok: true, mock: true, orderId: genFallbackId(), order };
  }

  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    ok: true,
    orderId: `BIC-${String(data.id).padStart(6, '0')}`,
    order: data,
  };
}
