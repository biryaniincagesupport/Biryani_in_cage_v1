import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Wallet, TrendingUp, Truck, Repeat, RefreshCcw } from 'lucide-react';
import {
  fetchOrders,
  deriveMetrics,
  deriveDailySeries,
  deriveStatusBreakdown,
} from '@/api/admin';
import { fmt } from '@/utils/cart';
import MetricCard from '@/components/admin/MetricCard';
import DailyChart from '@/components/admin/DailyChart';
import OrderRow from '@/components/admin/OrderRow';
import StatusBadge from '@/components/admin/StatusBadge';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const metrics = useMemo(() => deriveMetrics(orders), [orders]);
  const series = useMemo(() => deriveDailySeries(orders, 14), [orders]);
  const statuses = useMemo(() => deriveStatusBreakdown(orders), [orders]);
  const recent = orders.slice(0, 5);

  const onUpdated = (updated) => {
    setOrders((list) => list.map((o) => (o.id === updated.id ? updated : o)));
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-eyebrow">Overview</p>
          <h1 className="mt-2 font-display text-3xl text-bone sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-bone/60">
            Live orders, revenue, and ticket health — all in one room.
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

      {error && (
        <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading && orders.length === 0 ? (
        <SkeletonDashboard />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Total Revenue"
              value={fmt(metrics.totalRevenue)}
              sub={`${metrics.totalOrders} orders all-time`}
              icon={<Wallet size={14} />}
              accent
              delay={0}
            />
            <MetricCard
              label="Avg Order Value"
              value={fmt(metrics.avgOrderValue)}
              sub="excl. cancelled"
              icon={<TrendingUp size={14} />}
              delay={0.05}
            />
            <MetricCard
              label="Active Orders"
              value={metrics.activeOrders}
              sub="in the kitchen / out"
              icon={<Truck size={14} />}
              delay={0.1}
            />
            <MetricCard
              label="Completion Rate"
              value={`${metrics.completionRate}%`}
              sub={`${metrics.delivered} delivered · ${metrics.cancelled} cancelled`}
              icon={<Repeat size={14} />}
              delay={0.15}
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
            <DailyChart series={series} />

            <div className="rounded-3xl border border-saffron-400/15 bg-ink-900/60 p-6 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.3em] text-saffron-400/70">
                Status breakdown
              </p>
              <h3 className="mt-1 font-display text-xl text-bone">Where orders are right now</h3>
              <ul className="mt-5 space-y-3">
                {statuses.map((s) => (
                  <li key={s.status} className="flex items-center justify-between">
                    <StatusBadge status={s.status} />
                    <span className="font-display text-lg text-bone">{s.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-saffron-400/70">
                  Latest activity
                </p>
                <h2 className="mt-1 font-display text-xl text-bone">Recent orders</h2>
              </div>
              <Link
                to="/admin/orders"
                className="text-xs uppercase tracking-[0.2em] text-saffron-300 hover:text-saffron-100"
              >
                See all →
              </Link>
            </div>

            {recent.length === 0 ? (
              <EmptyOrders />
            ) : (
              <div className="space-y-2">
                {recent.map((o) => (
                  <OrderRow key={o.id} order={o} onUpdated={onUpdated} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function SkeletonDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-3xl border border-saffron-400/10 bg-ink-900/60" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-3xl border border-saffron-400/10 bg-ink-900/60" />
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="rounded-3xl border border-saffron-400/15 bg-ink-900/50 p-12 text-center">
      <ShoppingBag className="mx-auto text-saffron-400" size={20} />
      <p className="mt-4 font-display text-xl text-bone">No orders yet.</p>
      <p className="mt-2 text-sm text-bone/55">
        Once customers start checking out, they'll show up here in real time.
      </p>
    </div>
  );
}
