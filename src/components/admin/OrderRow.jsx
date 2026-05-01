import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Phone, MapPin } from 'lucide-react';
import StatusUpdater from './StatusUpdater';
import { fmt } from '@/utils/cart';

// Single row in the orders table. Click to expand inline with full detail.

export default function OrderRow({ order, onUpdated, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const itemCount = (order.items ?? []).reduce((s, i) => s + (i.quantity ?? 0), 0);
  const placedAt = new Date(order.created_at);

  return (
    <div className="rounded-2xl border border-saffron-400/10 bg-ink-900/60 transition hover:border-saffron-400/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="grid w-full grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 p-4 text-left"
      >
        <ChevronRight
          size={14}
          className={`text-bone/40 transition-transform ${open ? 'rotate-90' : ''}`}
        />
        <div className="min-w-0">
          <p className="truncate font-medium text-bone">
            {order.customer_name}{' '}
            <span className="text-bone/40">·</span>{' '}
            <span className="text-bone/60">{itemCount} items</span>
          </p>
          <p className="mt-0.5 truncate text-[11px] text-bone/45">
            {order.customer_phone} · {placedAt.toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </p>
        </div>
        <span className="hidden font-display text-base text-saffron-200 sm:inline">
          {fmt(order.total)}
        </span>
        <span onClick={(e) => e.stopPropagation()}>
          <StatusUpdater order={order} onUpdated={onUpdated} />
        </span>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-bone/35 lg:inline">
          #{order.id}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-saffron-400/10"
          >
            <div className="grid gap-6 p-5 md:grid-cols-2">
              <div className="space-y-3 text-sm">
                <Section title="Items">
                  <ul className="space-y-1.5">
                    {(order.items ?? []).map((it, i) => (
                      <li key={i} className="flex items-baseline justify-between gap-3 text-bone/85">
                        <span className="truncate">
                          <span className="text-bone/55">×{it.quantity}</span>{' '}
                          {it.name}
                        </span>
                        <span className="font-display text-saffron-200">
                          {fmt(it.line_total ?? it.unit_price * it.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section title="Bill">
                  <Row label="Subtotal" value={fmt(order.subtotal)} />
                  <Row
                    label="Delivery"
                    value={order.delivery_fee > 0 ? fmt(order.delivery_fee) : 'FREE'}
                  />
                  {order.gst_amount > 0 && (
                    <Row label="GST" value={fmt(order.gst_amount)} />
                  )}
                  <Row label="Total" value={fmt(order.total)} bold />
                  <Row label="Payment" value={order.payment_method?.toUpperCase() ?? '—'} />
                </Section>
              </div>

              <div className="space-y-3 text-sm">
                <Section title="Customer">
                  <div className="space-y-1 text-bone/85">
                    <p>{order.customer_name}</p>
                    <a
                      href={`tel:${(order.customer_phone || '').replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 text-saffron-300 hover:text-saffron-100"
                    >
                      <Phone size={12} /> {order.customer_phone}
                    </a>
                    {order.customer_email && (
                      <p className="text-bone/55">{order.customer_email}</p>
                    )}
                  </div>
                </Section>

                <Section title="Delivery address">
                  <div className="flex items-start gap-2 text-bone/85">
                    <MapPin size={13} className="mt-0.5 shrink-0 text-saffron-300" />
                    <div>
                      <p>{order.delivery_address?.line1}</p>
                      {order.delivery_address?.landmark && (
                        <p className="text-bone/60">
                          Landmark: {order.delivery_address.landmark}
                        </p>
                      )}
                      {order.delivery_address?.area && (
                        <p className="text-bone/60">{order.delivery_address.area}</p>
                      )}
                      <p className="text-bone/60">PIN {order.delivery_address?.pincode}</p>
                    </div>
                  </div>
                </Section>

                {order.special_instructions && (
                  <Section title="Notes">
                    <p className="rounded-xl border border-saffron-400/15 bg-ink-800/60 p-3 text-bone/85">
                      {order.special_instructions}
                    </p>
                  </Section>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] uppercase tracking-[0.3em] text-saffron-400/65">
        {title}
      </p>
      {children}
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div
      className={`flex items-baseline justify-between ${
        bold ? 'border-t border-saffron-400/10 pt-2 text-bone' : 'text-bone/70'
      }`}
    >
      <span>{label}</span>
      <span className={bold ? 'font-display text-base text-saffron-300' : 'font-medium'}>
        {value}
      </span>
    </div>
  );
}
