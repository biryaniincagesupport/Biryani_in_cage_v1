import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

// ─────────────────────────────────────────────────────────────────────────
// Admin data layer. Reads + status updates against the orders table.
// All RLS-gated by public.is_admin() — the queries here will fail with
// a 401-ish error if the signed-in user isn't on the allowlist.
// ─────────────────────────────────────────────────────────────────────────

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

export const STATUS_LABELS = {
  pending:          'Pending',
  confirmed:        'Confirmed',
  preparing:        'Preparing',
  out_for_delivery: 'Out for delivery',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
};

export const STATUS_TONE = {
  pending:          'amber',
  confirmed:        'sky',
  preparing:        'violet',
  out_for_delivery: 'saffron',
  delivered:        'emerald',
  cancelled:        'red',
};

const ACTIVE = ['pending', 'confirmed', 'preparing', 'out_for_delivery'];

// ─── Orders ─────────────────────────────────────────────────────────────

export async function fetchOrders({ limit = 200 } = {}) {
  if (!isSupabaseConfigured) return { data: [], unconfigured: true };
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return { data: data ?? [] };
}

export async function updateOrderStatus(id, status) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
  if (!ORDER_STATUSES.includes(status)) throw new Error(`Unknown status: ${status}`);
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// ─── Derivations (client-side aggregation; pilot-scale dataset) ────────

export function deriveMetrics(orders) {
  const totalOrders = orders.length;

  const liveOrders = orders.filter(
    (o) => !['cancelled'].includes(o.status),
  );
  const totalRevenue = liveOrders.reduce((s, o) => s + (o.total ?? 0), 0);
  const avgOrderValue = liveOrders.length
    ? Math.round(totalRevenue / liveOrders.length)
    : 0;

  const activeOrders = orders.filter((o) => ACTIVE.includes(o.status)).length;

  const delivered = orders.filter((o) => o.status === 'delivered').length;
  const cancelled = orders.filter((o) => o.status === 'cancelled').length;
  const completionRate = totalOrders
    ? Math.round((delivered / totalOrders) * 100)
    : 0;

  return {
    totalOrders,
    totalRevenue,
    avgOrderValue,
    activeOrders,
    delivered,
    cancelled,
    completionRate,
  };
}

// Last `days` days, returns [{ date: 'YYYY-MM-DD', label, orders, revenue }]
export function deriveDailySeries(orders, days = 14) {
  const now = new Date();
  const buckets = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.push({
      date: key,
      label: d.toLocaleString('en-IN', { day: 'numeric', month: 'short' }),
      orders: 0,
      revenue: 0,
    });
  }
  const idx = Object.fromEntries(buckets.map((b, i) => [b.date, i]));

  for (const o of orders) {
    if (o.status === 'cancelled') continue;
    const day = (o.created_at ?? '').slice(0, 10);
    if (idx[day] === undefined) continue;
    buckets[idx[day]].orders += 1;
    buckets[idx[day]].revenue += o.total ?? 0;
  }
  return buckets;
}

export function deriveStatusBreakdown(orders) {
  const counts = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0]));
  for (const o of orders) counts[o.status] = (counts[o.status] ?? 0) + 1;
  return ORDER_STATUSES.map((s) => ({
    status: s,
    label: STATUS_LABELS[s],
    tone: STATUS_TONE[s],
    count: counts[s],
  }));
}

// Aggregate by phone — phone is the closest thing to a customer ID for
// guest orders (same person may use slight name variants).
export function deriveCustomers(orders) {
  const map = new Map();
  for (const o of orders) {
    if (o.status === 'cancelled') continue;
    const key = (o.customer_phone || '').replace(/\s+/g, '');
    if (!key) continue;
    const entry = map.get(key) ?? {
      phone: o.customer_phone,
      names: new Set(),
      orderCount: 0,
      totalSpent: 0,
      lastOrderAt: null,
      firstOrderAt: null,
    };
    entry.names.add(o.customer_name);
    entry.orderCount += 1;
    entry.totalSpent += o.total ?? 0;
    const ts = new Date(o.created_at ?? 0).getTime();
    if (!entry.lastOrderAt || ts > entry.lastOrderAt) entry.lastOrderAt = ts;
    if (!entry.firstOrderAt || ts < entry.firstOrderAt) entry.firstOrderAt = ts;
    map.set(key, entry);
  }
  return [...map.values()]
    .map((c) => ({
      ...c,
      name: [...c.names][0],
      avgTicket: c.orderCount ? Math.round(c.totalSpent / c.orderCount) : 0,
      isRepeat: c.orderCount > 1,
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent);
}
