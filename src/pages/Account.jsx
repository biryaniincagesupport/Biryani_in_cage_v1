import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, MapPin, ClipboardList, LogOut, Loader2, Plus, Pencil, Trash2, Star, AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/state/AuthContext';
import { useCart } from '@/state/CartContext';
import {
  fetchProfile, upsertProfile,
  listAddresses, addAddress, updateAddress, deleteAddress,
  fetchMyOrders,
} from '@/api/profile';
import { rebuildLinesFromOrder } from '@/utils/reorder';
import AddressForm from '@/components/account/AddressForm';
import OrderHistoryCard from '@/components/account/OrderHistoryCard';
import { fadeUp } from '@/utils/motion';

const TABS = [
  { id: 'orders',    label: 'Orders',    icon: ClipboardList },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'profile',   label: 'Profile',   icon: User },
];

export default function AccountPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { clear: clearCart, addItem } = useCart();

  const [tab, setTab] = useState('orders');
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth.loading && auth.isAuthed) loadEverything();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.loading, auth.isAuthed, auth.user?.id]);

  async function loadEverything() {
    setLoading(true);
    setError('');
    try {
      const [p, o, a] = await Promise.all([
        fetchProfile(auth.user.id),
        fetchMyOrders(auth.user.id),
        listAddresses(auth.user.id),
      ]);
      setProfile(p);
      setOrders(o);
      setAddresses(a);
    } catch (e) {
      setError(e.message || 'Could not load your account.');
    } finally {
      setLoading(false);
    }
  }

  if (auth.loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center pt-[88px]">
        <Loader2 size={20} className="animate-spin text-saffron-300" />
      </main>
    );
  }

  if (!auth.isAuthed) {
    return <Navigate to="/" replace />;
  }

  const onReorder = async (order) => {
    const { lines, unavailable } = rebuildLinesFromOrder(order.items);
    if (lines.length === 0) {
      return { unavailable };
    }
    clearCart();
    for (const line of lines) addItem(line);
    if (unavailable.length === 0) {
      navigate('/checkout');
      return null;
    }
    return { unavailable };
  };

  return (
    <main className="pb-32 pt-[88px]">
      <section className="container-x py-12">
        <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">Your account</p>
            <h1 className="section-title mt-3">
              Hey <em className="not-italic">{(profile?.full_name || auth.email || '').split(' ')[0] || 'there'}</em>.
            </h1>
            <p className="mt-3 text-bone/65">
              Reorder favourites, manage addresses, keep your details fresh.
            </p>
          </div>
          <button
            type="button"
            onClick={async () => { await auth.signOut(); navigate('/'); }}
            className="btn-ghost !px-4 !py-2 text-xs"
          >
            <LogOut size={13} /> Sign out
          </button>
        </motion.div>

        <div className="mt-10 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                tab === t.id
                  ? 'border-saffron-400 bg-saffron-400 text-ink-950'
                  : 'border-saffron-400/20 bg-ink-900/60 text-bone/70 hover:text-bone'
              }`}
            >
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-2 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
            <AlertCircle size={14} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        <div className="mt-10">
          {loading ? (
            <Loading />
          ) : tab === 'orders' ? (
            <OrdersTab orders={orders} onReorder={onReorder} />
          ) : tab === 'addresses' ? (
            <AddressesTab
              userId={auth.user.id}
              addresses={addresses}
              onChanged={async () => setAddresses(await listAddresses(auth.user.id))}
            />
          ) : (
            <ProfileTab
              userId={auth.user.id}
              profile={profile}
              email={auth.email}
              onSaved={(p) => setProfile(p)}
            />
          )}
        </div>
      </section>
    </main>
  );
}

// ─── Orders tab ─────────────────────────────────────────────────────────

function OrdersTab({ orders, onReorder }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-saffron-400/15 bg-ink-900/50 p-12 text-center">
        <ClipboardList className="mx-auto text-saffron-400" size={20} />
        <p className="mt-4 font-display text-xl text-bone">No orders yet.</p>
        <p className="mt-2 text-sm text-bone/55">
          When you place your first order it'll show up here. Reordering takes one tap.
        </p>
        <Link to="/menu" className="btn-primary mt-6 inline-flex">See the menu</Link>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <OrderHistoryCard key={o.id} order={o} onReorder={onReorder} />
      ))}
    </div>
  );
}

// ─── Addresses tab ──────────────────────────────────────────────────────

function AddressesTab({ userId, addresses, onChanged }) {
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);

  const onCreate = async (form) => {
    setBusy(true);
    try { await addAddress(userId, form); await onChanged(); setCreating(false); }
    finally { setBusy(false); }
  };

  const onUpdate = async (form) => {
    setBusy(true);
    try { await updateAddress(userId, editingId, form); await onChanged(); setEditingId(null); }
    finally { setBusy(false); }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this address?')) return;
    setBusy(true);
    try { await deleteAddress(userId, id); await onChanged(); }
    finally { setBusy(false); }
  };

  const editing = addresses.find((a) => a.id === editingId);

  return (
    <div className="space-y-4">
      {addresses.length === 0 && !creating && (
        <div className="rounded-3xl border border-saffron-400/15 bg-ink-900/50 p-12 text-center">
          <MapPin className="mx-auto text-saffron-400" size={20} />
          <p className="mt-4 font-display text-xl text-bone">No saved addresses yet.</p>
          <p className="mt-2 text-sm text-bone/55">
            Save one and your next checkout takes seconds.
          </p>
        </div>
      )}

      {addresses.map((a) =>
        editingId === a.id ? (
          <AddressForm
            key={a.id}
            initial={a}
            busy={busy}
            onCancel={() => setEditingId(null)}
            onSubmit={onUpdate}
          />
        ) : (
          <div key={a.id} className="flex items-start justify-between gap-4 rounded-2xl border border-saffron-400/15 bg-ink-900/60 p-5">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-lg text-bone">{a.label || 'Address'}</span>
                {a.is_default && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-saffron-400/40 bg-saffron-400/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.25em] text-saffron-200">
                    <Star size={9} className="fill-saffron-300" /> Default
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm text-bone/85">{a.line1}</p>
              {a.landmark && <p className="text-sm text-bone/60">Landmark: {a.landmark}</p>}
              {a.area && <p className="text-sm text-bone/60">{a.area}</p>}
              <p className="text-sm text-bone/60">PIN {a.pincode}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <button
                type="button"
                onClick={() => setEditingId(a.id)}
                className="inline-flex items-center gap-1.5 text-xs text-saffron-300 hover:text-saffron-100"
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(a.id)}
                disabled={busy}
                className="inline-flex items-center gap-1.5 text-xs text-bone/55 hover:text-red-300"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ),
      )}

      {creating ? (
        <AddressForm busy={busy} onSubmit={onCreate} onCancel={() => setCreating(false)} />
      ) : (
        !editing && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="btn-ghost"
          >
            <Plus size={14} /> Add new address
          </button>
        )
      )}
    </div>
  );
}

// ─── Profile tab ────────────────────────────────────────────────────────

function ProfileTab({ userId, profile, email, onSaved }) {
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setSaved(false);
    try {
      const next = await upsertProfile(userId, form);
      onSaved(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4 rounded-2xl border border-saffron-400/15 bg-ink-900/60 p-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-saffron-400/70">
          Signed in as
        </p>
        <p className="mt-1 text-bone">{email}</p>
      </div>

      <Field label="Full name">
        <input
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          placeholder="Mayank Narayan"
          className={inputCls()}
        />
      </Field>
      <Field label="Phone">
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+91 79036 87499"
          className={inputCls()}
        />
      </Field>

      <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
        {busy ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Save changes'}
      </button>
      {saved && <span className="ml-2 text-[11px] uppercase tracking-[0.25em] text-emerald-300">Saved</span>}
    </form>
  );
}

const inputCls = () =>
  'w-full rounded-xl border border-saffron-400/20 bg-ink-900/70 px-4 py-2.5 text-sm text-bone placeholder:text-bone/40 outline-none transition focus:border-saffron-400/60 focus:shadow-neon-soft';

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-saffron-400/80">
        {label}
      </span>
      {children}
    </label>
  );
}

function Loading() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-2xl border border-saffron-400/10 bg-ink-900/60" />
      ))}
    </div>
  );
}
