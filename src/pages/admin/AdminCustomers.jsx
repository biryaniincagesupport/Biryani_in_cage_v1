import { useEffect, useMemo, useState } from 'react';
import { Search, X, Phone, RefreshCcw, Users } from 'lucide-react';
import { fetchOrders, deriveCustomers } from '@/api/admin';
import { fmt } from '@/utils/cart';

export default function AdminCustomers() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [showRepeat, setShowRepeat] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchOrders({ limit: 1000 });
      setOrders(data);
    } catch (e) {
      setError(e.message || 'Failed to load.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const customers = useMemo(() => deriveCustomers(orders), [orders]);

  const filtered = useMemo(() => {
    let list = customers;
    if (showRepeat) list = list.filter((c) => c.isRepeat);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        (c.phone || '').replace(/\D/g, '').includes(q.replace(/\D/g, '')),
      );
    }
    return list;
  }, [customers, query, showRepeat]);

  const totalRepeat = customers.filter((c) => c.isRepeat).length;
  const lifetimeRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const overallAOV = customers.length
    ? Math.round(lifetimeRevenue / customers.reduce((s, c) => s + c.orderCount, 0))
    : 0;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-eyebrow">Crowd</p>
          <h1 className="mt-2 font-display text-3xl text-bone sm:text-4xl">Customers</h1>
          <p className="mt-2 text-sm text-bone/60">
            Aggregated by phone — repeat customers, biggest spenders, AOV at a glance.
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

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label="Unique customers" value={customers.length} />
        <Stat label="Repeat customers" value={`${totalRepeat} (${customers.length ? Math.round((totalRepeat / customers.length) * 100) : 0}%)`} />
        <Stat label="Overall AOV" value={fmt(overallAOV)} />
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-saffron-400/70" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or phone…"
            className="w-full rounded-full border border-saffron-400/20 bg-ink-900/70 py-2.5 pl-10 pr-9 text-sm text-bone placeholder:text-bone/40 outline-none transition focus:border-saffron-400/60 focus:shadow-neon-soft"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-bone/50"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs uppercase tracking-[0.2em] text-bone/60">
          <input
            type="checkbox"
            checked={showRepeat}
            onChange={(e) => setShowRepeat(e.target.checked)}
            className="h-3.5 w-3.5 accent-saffron-400"
          />
          Repeat only
        </label>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading && customers.length === 0 ? (
        <Skeleton />
      ) : filtered.length === 0 ? (
        <Empty />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-saffron-400/15 bg-ink-900/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-saffron-400/10 text-[10px] uppercase tracking-[0.25em] text-saffron-400/65">
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Phone</th>
                <th className="px-5 py-3 text-right">Orders</th>
                <th className="px-5 py-3 text-right">Total spent</th>
                <th className="px-5 py-3 text-right">Avg ticket</th>
                <th className="px-5 py-3 text-right">Last order</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.phone}
                  className="border-b border-saffron-400/5 transition last:border-b-0 hover:bg-saffron-400/5"
                >
                  <td className="px-5 py-3">
                    <div className="font-medium text-bone">{c.name}</div>
                    {c.isRepeat && (
                      <span className="mt-1 inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/5 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-emerald-200">
                        Repeat
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <a
                      href={`tel:${(c.phone || '').replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 text-saffron-300 hover:text-saffron-100"
                    >
                      <Phone size={11} /> {c.phone}
                    </a>
                  </td>
                  <td className="px-5 py-3 text-right text-bone">{c.orderCount}</td>
                  <td className="px-5 py-3 text-right font-display text-saffron-300">
                    {fmt(c.totalSpent)}
                  </td>
                  <td className="px-5 py-3 text-right text-bone/85">{fmt(c.avgTicket)}</td>
                  <td className="px-5 py-3 text-right text-[11px] uppercase tracking-[0.18em] text-bone/55">
                    {c.lastOrderAt
                      ? new Date(c.lastOrderAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                        })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-saffron-400/15 bg-ink-900/60 p-5">
      <p className="text-[10px] uppercase tracking-[0.3em] text-saffron-400/70">{label}</p>
      <p className="mt-2 font-display text-2xl text-bone">{value}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-2xl border border-saffron-400/10 bg-ink-900/60" />
      ))}
    </div>
  );
}

function Empty() {
  return (
    <div className="rounded-3xl border border-saffron-400/15 bg-ink-900/50 p-12 text-center">
      <Users className="mx-auto text-saffron-400" size={20} />
      <p className="mt-4 font-display text-xl text-bone">No customers yet.</p>
      <p className="mt-2 text-sm text-bone/55">
        Once orders start landing, customers show up here aggregated by phone.
      </p>
    </div>
  );
}
