import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, AlertCircle, Wallet, User } from 'lucide-react';
import { useCart } from '@/state/CartContext';
import { useAuth } from '@/state/AuthContext';
import { computeTotals } from '@/utils/cart';
import { placeOrder } from '@/api/orders';
import { openWhatsappTicket, buildWhatsappLink } from '@/services/whatsapp';
import { listAddresses, addAddress, fetchProfile } from '@/api/profile';
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentMethod from '@/components/checkout/PaymentMethod';
import OrderSuccess from '@/components/checkout/OrderSuccess';
import SavedAddresses from '@/components/checkout/SavedAddresses';
import AuthModal from '@/components/auth/AuthModal';
import { fadeUp } from '@/utils/motion';

const DRAFT_KEY = 'bic-checkout-draft-v1';

const initial = {
  name: '',
  phone: '',
  email: '',
  line1: '',
  landmark: '',
  area: '',
  pincode: '',
  specialInstructions: '',
  paymentMethod: 'cod',
};

export default function CheckoutPage() {
  const { items, isEmpty, clear } = useCart();
  const auth = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ status: 'idle', message: '' });
  const [success, setSuccess] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [saveAddressFlag, setSaveAddressFlag] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  // Hydrate draft from localStorage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) setForm((f) => ({ ...f, ...JSON.parse(raw) }));
    } catch {
      /* ignore */
    }
  }, []);

  // When the user signs in, prefill form from profile + load saved addresses.
  useEffect(() => {
    if (!auth.isAuthed || !auth.user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const [p, addr] = await Promise.all([
          fetchProfile(auth.user.id),
          listAddresses(auth.user.id),
        ]);
        if (cancelled) return;
        setSavedAddresses(addr);
        // Prefill name/phone/email from profile if the form is empty.
        setForm((f) => ({
          ...f,
          name:  f.name  || p?.full_name || '',
          phone: f.phone || p?.phone     || '',
          email: f.email || auth.email   || '',
        }));
        // Auto-pick the default address (or the most recent) on first load.
        const def = addr.find((a) => a.is_default) ?? addr[0];
        if (def) {
          setSelectedAddressId(def.id);
          setForm((f) => ({
            ...f,
            line1:    def.line1,
            landmark: def.landmark || '',
            area:     def.area || '',
            pincode:  def.pincode,
          }));
        }
      } catch {
        /* RLS / network — fall back to manual entry */
      }
    })();
    return () => { cancelled = true; };
  }, [auth.isAuthed, auth.user?.id, auth.email]);

  // Persist draft (debounced not necessary — small object).
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* ignore */
    }
  }, [form]);

  // If the cart was emptied externally and we don't have a success yet,
  // bounce back to the menu.
  useEffect(() => {
    if (isEmpty && !success) {
      const t = setTimeout(() => navigate('/menu', { replace: true }), 50);
      return () => clearTimeout(t);
    }
  }, [isEmpty, success, navigate]);

  if (success) {
    return (
      <main className="pt-[88px]">
        <OrderSuccess
          orderId={success.orderId}
          total={success.total}
          customerName={success.customerName}
          address={success.address}
          whatsappLink={success.whatsappLink}
          whatsappOpened={success.whatsappOpened}
        />
      </main>
    );
  }

  if (isEmpty) {
    return (
      <main className="container-x flex min-h-[60vh] items-center justify-center pt-[88px]">
        <div className="text-center">
          <p className="font-display text-2xl text-bone">Your cart is empty.</p>
          <Link to="/menu" className="btn-primary mt-6 inline-flex">Browse menu</Link>
        </div>
      </main>
    );
  }

  const set = (patch) => {
    setForm((f) => ({ ...f, ...patch }));
    if (Object.keys(errors).length) setErrors({});
    // Editing the address fields detaches the saved-address selection
    // so we don't accidentally re-save someone's existing address.
    if (selectedAddressId &&
        ('line1' in patch || 'landmark' in patch || 'area' in patch || 'pincode' in patch)) {
      setSelectedAddressId(null);
    }
  };

  const onSelectSavedAddress = (addr) => {
    if (!addr) {
      setSelectedAddressId(null);
      setForm((f) => ({ ...f, line1: '', landmark: '', area: '', pincode: '' }));
      return;
    }
    setSelectedAddressId(addr.id);
    setSaveAddressFlag(false);
    setForm((f) => ({
      ...f,
      line1:    addr.line1,
      landmark: addr.landmark || '',
      area:     addr.area || '',
      pincode:  addr.pincode,
    }));
    if (Object.keys(errors).length) setErrors({});
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Tell us your name.';
    const cleanedPhone = form.phone.replace(/\s+/g, '');
    if (!/^(\+?\d{10,13})$/.test(cleanedPhone)) e.phone = 'Enter a valid phone (10 digits).';
    if (!form.line1.trim()) e.line1 = 'House / building / street is required.';
    if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = 'Enter a 6-digit PIN code.';
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const eMap = validate();
    if (Object.keys(eMap).length) {
      setErrors(eMap);
      // Scroll first error into view.
      const firstKey = Object.keys(eMap)[0];
      document.querySelector(`[name="${firstKey}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const totals = computeTotals(items);
    const address = {
      line1:    form.line1,
      landmark: form.landmark,
      area:     form.area,
      pincode:  form.pincode,
    };

    const orderForWa = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      address,
      paymentMethod: form.paymentMethod,
      specialInstructions: form.specialInstructions,
    };

    // Build the wa.me link first, then open WhatsApp synchronously inside
    // this user-gesture handler. Browsers only honour window.open during
    // interaction — calling it after the await may get blocked.
    const { link: whatsappLink, opened: whatsappOpened } = openWhatsappTicket({
      order: orderForWa,
      items,
      totals,
    });

    setState({ status: 'loading', message: '' });
    try {
      const res = await placeOrder({
        ...form,
        items,
        totals,
        userId: auth.user?.id ?? null,
      });

      // Save the typed address to the user's address book if they ticked
      // the box (only when signed in and not using an existing saved one).
      if (auth.isAuthed && saveAddressFlag && !selectedAddressId) {
        try {
          await addAddress(auth.user.id, {
            label:    null,
            line1:    form.line1,
            landmark: form.landmark || null,
            area:     form.area || null,
            pincode:  form.pincode,
            is_default: savedAddresses.length === 0,
          });
        } catch {
          /* non-blocking — order's already placed */
        }
      }

      // Rebuild link with the persisted orderId so the fallback button
      // sends the same payload but tagged with the real reference.
      const linkWithId = res.orderId
        ? buildWhatsappLink({ order: orderForWa, items, totals, orderId: res.orderId })
        : whatsappLink;

      setSuccess({
        orderId:        res.orderId,
        total:          totals.total,
        customerName:   form.name,
        address,
        whatsappLink:   linkWithId,
        whatsappOpened,
      });

      clear();
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      setState({
        status: 'error',
        message: err.message || 'Could not place the order. Please try again.',
      });
    }
  };

  return (
    <main className="pb-20 pt-[88px]">
      <section className="container-x py-10 sm:py-14">
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-bone/60 transition hover:text-saffron-300"
        >
          <ArrowLeft size={13} /> Back to menu
        </Link>

        <motion.div {...fadeUp} className="mt-6 max-w-2xl">
          <p className="section-eyebrow">Almost there</p>
          <h1 className="section-title mt-3">
            <em>Checkout</em>.
          </h1>
          <p className="mt-4 text-bone/70">
            One short form. Then sit back and let us cook.
          </p>
        </motion.div>

        {!auth.isAuthed && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-saffron-400/20 bg-saffron-400/5 px-5 py-4">
            <div className="flex items-start gap-3">
              <User size={16} className="mt-0.5 text-saffron-300" />
              <div>
                <p className="text-sm text-bone">
                  Sign in to <strong className="text-saffron-200">load saved addresses</strong> and{' '}
                  <strong className="text-saffron-200">track your orders</strong>.
                </p>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-bone/45">
                  Optional · guest checkout still works
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="btn-ghost !px-4 !py-2 text-xs"
            >
              Sign in
            </button>
          </div>
        )}

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <form onSubmit={onSubmit} className="space-y-8">
            <Section title="Who's eating">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name *" error={errors.name}>
                  <input
                    name="name"
                    value={form.name}
                    onChange={(e) => set({ name: e.target.value })}
                    placeholder="Mayank Narayan"
                    className={inputCls(errors.name)}
                    autoComplete="name"
                  />
                </Field>
                <Field label="Phone *" error={errors.phone}>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set({ phone: e.target.value })}
                    placeholder="+91 79036 87499"
                    className={inputCls(errors.phone)}
                    autoComplete="tel"
                  />
                </Field>
                <Field label="Email" className="sm:col-span-2">
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set({ email: e.target.value })}
                    placeholder="you@example.com"
                    className={inputCls()}
                    autoComplete="email"
                  />
                </Field>
              </div>
            </Section>

            <Section title="Where to deliver">
              {auth.isAuthed && savedAddresses.length > 0 && (
                <div className="mb-5">
                  <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-saffron-400/80">
                    Saved addresses
                  </p>
                  <SavedAddresses
                    addresses={savedAddresses}
                    selectedId={selectedAddressId}
                    onSelect={onSelectSavedAddress}
                  />
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="House / Building / Street *" className="sm:col-span-2" error={errors.line1}>
                  <input
                    name="line1"
                    value={form.line1}
                    onChange={(e) => set({ line1: e.target.value })}
                    placeholder="Plot 42, Hira Lodge, Tower Chowk"
                    className={inputCls(errors.line1)}
                    autoComplete="address-line1"
                  />
                </Field>
                <Field label="Landmark">
                  <input
                    name="landmark"
                    value={form.landmark}
                    onChange={(e) => set({ landmark: e.target.value })}
                    placeholder="Opposite Reliance Trends"
                    className={inputCls()}
                  />
                </Field>
                <Field label="Locality / Area">
                  <input
                    name="area"
                    value={form.area}
                    onChange={(e) => set({ area: e.target.value })}
                    placeholder="Bompass Town"
                    className={inputCls()}
                    autoComplete="address-level2"
                  />
                </Field>
                <Field label="PIN code *" error={errors.pincode}>
                  <input
                    name="pincode"
                    inputMode="numeric"
                    value={form.pincode}
                    onChange={(e) => set({ pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    placeholder="814112"
                    className={inputCls(errors.pincode)}
                    autoComplete="postal-code"
                  />
                </Field>
                <Field label="Notes for the kitchen" className="sm:col-span-2">
                  <textarea
                    name="specialInstructions"
                    value={form.specialInstructions}
                    onChange={(e) => set({ specialInstructions: e.target.value })}
                    placeholder="Less spicy, no onions, ring bell twice…"
                    rows={3}
                    className={`${inputCls()} resize-none`}
                  />
                </Field>
              </div>

              {auth.isAuthed && !selectedAddressId && form.line1 && (
                <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-xs uppercase tracking-[0.2em] text-bone/65">
                  <input
                    type="checkbox"
                    checked={saveAddressFlag}
                    onChange={(e) => setSaveAddressFlag(e.target.checked)}
                    className="h-3.5 w-3.5 accent-saffron-400"
                  />
                  Save this address for next time
                </label>
              )}
            </Section>

            <Section title="How you're paying">
              <PaymentMethod
                value={form.paymentMethod}
                onChange={(v) => set({ paymentMethod: v })}
              />
            </Section>

            {state.status === 'error' && (
              <div className="flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{state.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={state.status === 'loading'}
              className="btn-primary w-full !py-4 text-base disabled:opacity-60"
            >
              {state.status === 'loading' ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Placing your order…
                </>
              ) : (
                <>
                  <Wallet size={16} /> Place order · Pay on delivery
                </>
              )}
            </button>

            <p className="text-center text-[11px] uppercase tracking-[0.25em] text-bone/40">
              By placing this order you agree to be called for confirmation.
            </p>
          </form>

          <OrderSummary />
        </div>
      </section>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        redirectPath="/checkout"
        title="Sign in to checkout faster"
        subtitle="Your saved address and history will load automatically."
      />
    </main>
  );
}

const inputCls = (error) =>
  `w-full rounded-xl border bg-ink-900/70 px-4 py-3 text-sm text-bone placeholder:text-bone/40 outline-none transition ${
    error
      ? 'border-red-400/60 focus:border-red-400'
      : 'border-saffron-400/20 focus:border-saffron-400/60 focus:shadow-neon-soft'
  }`;

function Section({ title, children }) {
  return (
    <section className="space-y-5">
      <h2 className="font-display text-xl text-bone">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children, className = '', error }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-saffron-400/80">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 block text-[11px] text-red-300">{error}</span>
      )}
    </label>
  );
}
