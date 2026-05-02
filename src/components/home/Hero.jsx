import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, Star, Sparkles, ArrowRight } from 'lucide-react';
import CageBars from '@/components/ui/CageBars';
import { NeonWordmark } from '@/components/ui/NeonText';
import MagneticButton from '@/components/ui/MagneticButton';
import { SITE } from '@/data/site';

// Hero — ambient restaurant photo behind glossy cage bars that part open
// after the page loads. Wordmark glows into view, then sub-CTAs.

export default function Hero() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {/* Backdrop photo */}
      <div className="absolute inset-0">
        <img
          src="/photos/entrance-floral-wall.jpg"
          alt="Biryani In Cage entrance"
          className="h-full w-full object-cover scale-110"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/45 to-ink-950" />
        <div className="absolute inset-0 bg-radial-glow opacity-80" />
      </div>

      {/* Cage bars that open */}
      <CageBars count={16} open={open} className="z-10" />

      {/* Content */}
      <div className="container-x relative z-20 flex h-full flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="chip mb-6"
        >
          <Star size={12} className="fill-saffron-400 text-saffron-400" />
          #1 Biryani · Deoghar · Zomato
        </motion.div>

        <NeonWordmark className="max-w-3xl" />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-xl text-balance text-base text-bone/80 sm:text-lg"
        >
          Slow-dum biryani, themed cage booths, and a vibe Deoghar fell in love with.
          Order direct or dine inside the cage.
        </motion.p>

        {/* Value-prop banner — only renders above the CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.05, duration: 0.6 }}
          className="mt-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-emerald-200 sm:text-xs"
        >
          <Sparkles size={11} className="text-emerald-300" />
          Save more · No platform fee · No hidden charges
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center"
        >
          {/* Hero CTA — direct order. Larger, brighter, with the "save" hook. */}
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/menu"
              className="btn-primary !px-8 !py-4 text-base font-bold shadow-neon"
            >
              Order Now <ArrowRight size={15} />
            </Link>
          </motion.div>
          <MagneticButton
            as="a"
            href={SITE.links.zomato}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost !px-7 !py-3.5 text-base"
          >
            Order on Zomato
          </MagneticButton>
          <MagneticButton
            as="a"
            href={SITE.links.swiggy}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost !px-7 !py-3.5 text-base"
          >
            Order on Swiggy
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-saffron-400/70">
            <span className="text-[10px] tracking-[0.4em] uppercase">Scroll · The cage is open</span>
            <ArrowDown size={14} className="animate-bounce" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
