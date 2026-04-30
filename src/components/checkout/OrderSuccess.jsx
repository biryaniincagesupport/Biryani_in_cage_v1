import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Phone, Wallet, Clock, MapPin, Copy, Send } from 'lucide-react';
import { SITE } from '@/data/site';
import { fmt } from '@/utils/cart';
import { useState } from 'react';

// Shown after successful order placement. The order ticket auto-opens
// in WhatsApp on submit — if that gets blocked, the prominent fallback
// button here re-tries it with the same pre-filled payload.

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.71.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004A9.87 9.87 0 0 1 7.1 20.45l-.355-.21-3.677.964.985-3.588-.232-.367a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.889-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.892 6.994c-.003 5.45-4.437 9.885-9.889 9.885zm0-21.85C5.495 0 .16 5.335.156 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.892-11.893a11.821 11.821 0 0 0-3.48-8.413A11.824 11.824 0 0 0 12.05 0z"/>
  </svg>
);

export default function OrderSuccess({
  orderId,
  total,
  customerName,
  address,
  whatsappLink,
  whatsappOpened,
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(orderId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="container-x relative py-16"
    >
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.2 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full border-2 border-saffron-400/40 bg-saffron-400/10 shadow-neon"
        >
          <CheckCircle2 size={32} className="text-saffron-300" />
        </motion.div>

        <p className="mt-8 section-eyebrow">Order placed</p>
        <h1 className="mt-3 font-display text-4xl text-bone sm:text-6xl">
          Caged. <em className="not-italic neon-text">And on its way.</em>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-bone/70">
          Hey {customerName?.split(' ')[0] || 'there'}, we got your order. The
          kitchen's already moving. We'll call you on the registered number to
          confirm.
        </p>

        <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full border border-saffron-400/30 bg-ink-900/70 px-5 py-3 backdrop-blur">
          <span className="text-[11px] uppercase tracking-[0.3em] text-saffron-400/70">
            Order ID
          </span>
          <span className="font-display text-bone">{orderId}</span>
          <button
            type="button"
            onClick={copy}
            className="text-saffron-300 transition hover:text-saffron-100"
            aria-label="Copy order ID"
          >
            <Copy size={13} />
          </button>
          {copied && (
            <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-300">
              copied
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-4 md:grid-cols-3">
        <Tile icon={<Clock size={16} />} label="ETA" value="30 – 45 min" />
        <Tile icon={<Wallet size={16} />} label="Amount due" value={fmt(total)} accent />
        <Tile
          icon={<Phone size={16} />}
          label="Restaurant"
          value={SITE.phone}
          href={`tel:${SITE.phone.replace(/\s+/g, '')}`}
        />
      </div>

      {whatsappLink && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-10 max-w-3xl rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 via-ink-900 to-ink-950 p-6 backdrop-blur"
        >
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#25D366]/20 text-[#25D366]">
              <WhatsAppIcon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl text-bone">
                {whatsappOpened
                  ? 'Order ticket sent to our WhatsApp'
                  : 'One last step — send the ticket to our WhatsApp'}
              </h2>
              <p className="mt-2 text-sm text-bone/70 leading-relaxed">
                {whatsappOpened ? (
                  <>
                    A WhatsApp tab just opened with your order pre-typed for{' '}
                    <strong className="text-bone">Biryani In Cage</strong>. Tap{' '}
                    <strong className="text-emerald-200">Send</strong> there to
                    confirm. Didn't see it? Use the button below.
                  </>
                ) : (
                  <>
                    Your browser blocked the auto-open. Tap the button below —
                    it'll open WhatsApp with your order pre-filled, addressed to
                    us. Tap <strong className="text-emerald-200">Send</strong>{' '}
                    and we're on it.
                  </>
                )}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-display text-sm font-bold text-white shadow-[0_0_24px_rgba(37,211,102,0.45)] transition hover:bg-[#1ebe57]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {whatsappOpened
                    ? 'Open WhatsApp again'
                    : 'Send order ticket on WhatsApp'}
                  <Send size={13} />
                </a>
                <span className="text-[11px] uppercase tracking-[0.25em] text-bone/45">
                  Direct line · zero waiting
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mx-auto mt-6 max-w-3xl rounded-3xl border border-saffron-400/15 bg-ink-900/60 p-6 backdrop-blur">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-saffron-400/30 bg-saffron-400/10 text-saffron-300">
            <Wallet size={20} />
          </div>
          <div>
            <h2 className="font-display text-xl text-bone">Pay at the door</h2>
            <p className="mt-2 text-sm text-bone/70 leading-relaxed">
              Our delivery person carries a UPI QR — pay with{' '}
              <strong className="text-saffron-200">BHIM UPI / PhonePe / Paytm / Google Pay</strong>{' '}
              by scanning, or settle in cash. Whichever's faster for you.
            </p>
          </div>
        </div>
      </div>

      {address && (
        <div className="mx-auto mt-6 max-w-3xl rounded-3xl border border-saffron-400/15 bg-ink-900/60 p-6 backdrop-blur">
          <div className="flex items-start gap-4">
            <MapPin className="mt-1 text-saffron-300" size={18} />
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-saffron-400/70">
                Delivering to
              </p>
              <p className="mt-2 text-sm text-bone">{address.line1}</p>
              {address.landmark && (
                <p className="text-sm text-bone/70">Landmark: {address.landmark}</p>
              )}
              {address.area && <p className="text-sm text-bone/70">{address.area}</p>}
              <p className="text-sm text-bone/70">PIN {address.pincode}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-3 sm:flex-row">
        <Link to="/menu" className="btn-primary">Order something else</Link>
        <a
          href={`tel:${SITE.phone.replace(/\s+/g, '')}`}
          className="btn-ghost"
        >
          <Phone size={14} /> Need to change something? Call us
        </a>
      </div>
    </motion.div>
  );
}

function Tile({ icon, label, value, accent, href }) {
  const inner = (
    <div
      className={`rounded-2xl border p-5 backdrop-blur transition ${
        accent
          ? 'border-saffron-400/40 bg-saffron-400/5'
          : 'border-saffron-400/15 bg-ink-900/60 hover:border-saffron-400/30'
      }`}
    >
      <div className="flex items-center gap-2 text-saffron-300">
        {icon}
        <span className="text-[10px] uppercase tracking-[0.3em]">{label}</span>
      </div>
      <p
        className={`mt-3 font-display ${
          accent ? 'text-3xl neon-text' : 'text-2xl text-bone'
        }`}
      >
        {value}
      </p>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}
