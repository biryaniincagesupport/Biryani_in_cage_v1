import { useEffect, useMemo, useState } from 'react';
import { Search, X, RefreshCcw, ShoppingBag } from 'lucide-react';
import {
  fetchOrders,
  ORDER_STATUSES,
  STATUS_LABELS,
} from '@/api/admin';
import OrderRow from '@/components/admin/OrderRow';
import { cn } from '@/utils/cn';

const FILTERS = [
  { id: 'all',     label: 'All' },
  { id: 'active',  label: 'Active' },
  ...ORDER_STATUSES.map((s) => ({ id: s, label: STATUS_LABELS[s] })),
];

const ACTIVE_SET = new Set(['pending', 'confirmed', 'preparing', 'out_for_delivery']);

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchOrders({ limit: 500 });
      setOrders(data);
    } catch (e) {
      setError(e.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let list = orders;
    if (filter === 'active') list = list.filter((o) => ACTIVE_SET.has(o.status));
    else if (filter !== 'all') list = list.filter((o) => o.status === filter);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((o) => {
        const cleanPhone = (o.customer_phone || '').replace(/\D/g, '');
        return (
          (o.customer_name || '').toLowerCase().includes(q) ||
          cleanPhone.includes(q.replace(/\D/g, '')) ||
          String(o.id).includes(q) ||
          (o.delivery_address?.line1 || '').toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [orders, filter, query]);

  const onUpdated = (u) => setOrders((list) => list.map((o) => (o.id === u.id ? u : o)));

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-eyebrow">Operations</p>
          <h1 className="mt-2 font-display text-3xl text-bone sm:text-4xl">Orders</h1>
          <p className="mt-2 text-sm text-bone/60">
            Search, filter, expand any row to see items & address. Tap the
            status pill to flip it through the kitchen flow.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="btn-ghost !px-4 !py-2 text-xs"
        >
          <RefreshCcw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </header>

      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-saffron-400/70" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, phone, order ID, address…"
            className="w-full rounded-full border border-saffron-400/20 bg-ink-900/70 py-2.5 pl-10 pr-9 text-sm text-bone placeholder:text-bone/40 outline-none transition focus:border-saffron-400/60 focus:shadow-neon-soft"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-bone/50 hover:text-bone"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] transition',
                filter === f.id
                  ? 'border-saffron-400 bg-saffron-400 text-ink-950'
                  : 'border-saffron-400/20 text-bone/65 hover:text-bone',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="text-[11px] uppercase tracking-[0.25em] text-bone/40">
        {filtered.length} {filtered.length === 1 ? 'order' : 'orders'}
      </div>

      {loading && orders.length === 0 ? (
        <SkeletonRows />
      ) : filtered.length === 0 ? (
        <Empty />
      ) : (
        <div className="space-y-2">
          {filtered.map((o) => (
            <OrderRow key={o.id} order={o} onUpdated={onUpdated} />
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-2xl border border-saffron-400/10 bg-ink-900/60" />
      ))}
    </div>
  );
}

function Empty() {
  return (
    <div className="rounded-3xl border border-saffron-400/15 bg-ink-900/50 p-12 text-center">
      <ShoppingBag className="mx-auto text-saffron-400" size={20} />
      <p className="mt-4 font-display text-xl text-bone">Nothing matches.</p>
      <p className="mt-2 text-sm text-bone/55">Try a different filter or search term.</p>
    </div>
  );
}
