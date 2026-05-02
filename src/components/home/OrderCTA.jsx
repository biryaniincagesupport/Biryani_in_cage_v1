import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { SITE } from '@/data/site';
import { fadeUp } from '@/utils/motion';

// Hero "Order Now" card — direct ordering on biryaniincage.com.
// Visually heaviest (gold tint, neon glow, "save" pill) so the eye lands
// here first. Sits left in the desktop grid, top on mobile.
const OrderNowCard = () => (
  <Link
    to="/menu"
    className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-saffron-400/50 bg-gradient-to-br from-saffron-400/20 via-ink-900 to-ink-950 p-8 shadow-neon transition-all hover:-translate-y-1 hover:border-saffron-400/80 lg:col-span-1 lg:row-span-1"
  >
    <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-saffron-400/40 blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saffron-400/70 to-transparent" />

    <div className="relative">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-saffron-400 px-3 py-1 font-display text-xs uppercase tracking-[0.3em] text-ink-950">
          Order Now
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.25em] text-emerald-200">
          <Tag size={10} /> Save 15–20%
        </span>
      </div>
      <h3 className="mt-6 font-display text-3xl text-bone">Direct on biryaniincage.com</h3>
      <p className="mt-3 max-w-sm text-sm text-bone/80 leading-relaxed">
        Order from our website — <strong className="text-saffron-200">no platform fee, no hidden charges</strong>.
        Save what Zomato and Swiggy take. Same kitchen. Same biryani.
      </p>

      <ul className="mt-5 grid grid-cols-1 gap-2 text-[11px] uppercase tracking-[0.18em] text-bone/65 sm:grid-cols-2">
        <li className="flex items-center gap-1.5"><ShieldCheck size={11} className="text-saffron-300" /> No platform fee</li>
        <li className="flex items-center gap-1.5"><ShieldCheck size={11} className="text-saffron-300" /> No hidden charges</li>
        <li className="flex items-center gap-1.5"><ShieldCheck size={11} className="text-saffron-300" /> COD or UPI on delivery</li>
        <li className="flex items-center gap-1.5"><ShieldCheck size={11} className="text-saffron-300" /> Order ticket on WhatsApp</li>
      </ul>
    </div>

    <div className="mt-10 inline-flex items-center gap-2 font-display text-sm tracking-wider text-saffron-200">
      Start ordering <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
    </div>
  </Link>
);

const ZomatoCard = ({ href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-[#E23744]/30 bg-gradient-to-br from-[#E23744]/15 via-ink-900 to-ink-950 p-8 transition-all hover:-translate-y-1 hover:border-[#E23744]/70"
  >
    <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#E23744]/30 blur-3xl opacity-50 transition-opacity duration-500 group-hover:opacity-90" />
    <div className="relative">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-[#E23744] px-3 py-1 font-display text-xs uppercase tracking-[0.3em] text-white">
          Zomato
        </span>
        <span className="text-[10px] uppercase tracking-[0.3em] text-saffron-400">#1 Biryani</span>
      </div>
      <h3 className="mt-6 font-display text-3xl text-bone">Order on Zomato</h3>
      <p className="mt-3 max-w-sm text-sm text-bone/70">
        Tap straight through to our Zomato page. Fastest checkout, full menu.
      </p>
    </div>
    <div className="mt-10 inline-flex items-center gap-2 font-display text-sm tracking-wider text-bone/85">
      Open Zomato <ExternalLink size={14} className="transition-transform group-hover:translate-x-0.5" />
    </div>
  </a>
);

const SwiggyCard = ({ href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-[#F26722]/30 bg-gradient-to-br from-[#F26722]/15 via-ink-900 to-ink-950 p-8 transition-all hover:-translate-y-1 hover:border-[#F26722]/70"
  >
    <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#F26722]/30 blur-3xl opacity-50 transition-opacity duration-500 group-hover:opacity-90" />
    <div className="relative">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-[#F26722] px-3 py-1 font-display text-xs uppercase tracking-[0.3em] text-white">
          Swiggy
        </span>
        <span className="text-[10px] uppercase tracking-[0.3em] text-saffron-400">#2 Biryani</span>
      </div>
      <h3 className="mt-6 font-display text-3xl text-bone">Order on Swiggy</h3>
      <p className="mt-3 max-w-sm text-sm text-bone/70">
        Already on Swiggy? Hop in, your biryani is two taps away.
      </p>
    </div>
    <div className="mt-10 inline-flex items-center gap-2 font-display text-sm tracking-wider text-bone/85">
      Open Swiggy <ExternalLink size={14} className="transition-transform group-hover:translate-x-0.5" />
    </div>
  </a>
);

export default function OrderCTA() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-x">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-emerald-200">
            <Sparkles size={10} className="text-emerald-300" /> Best price · biryaniincage.com
          </span>
          <h2 className="section-title mt-4">
            Three taps. <em>Lowest</em> on the website.
          </h2>
          <p className="mt-5 text-bone/70">
            Order direct here for the best price — no platform fee, no hidden charges.
            Or use Zomato/Swiggy if that's where you live.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          <OrderNowCard />
          <ZomatoCard href={SITE.links.zomato} />
          <SwiggyCard href={SITE.links.swiggy} />
        </div>
      </div>
    </section>
  );
}
