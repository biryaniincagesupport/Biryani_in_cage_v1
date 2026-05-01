import { motion } from 'framer-motion';

export default function MetricCard({ label, value, sub, icon, accent = false, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-3xl border p-6 backdrop-blur ${
        accent
          ? 'border-saffron-400/40 bg-gradient-to-br from-saffron-400/10 via-ink-900 to-ink-950'
          : 'border-saffron-400/15 bg-ink-900/60'
      }`}
    >
      <div className="flex items-center justify-between text-saffron-300">
        <span className="text-[10px] uppercase tracking-[0.3em]">{label}</span>
        {icon && <span className="opacity-80">{icon}</span>}
      </div>
      <div className={`mt-4 font-display ${accent ? 'text-4xl neon-text' : 'text-3xl text-bone'}`}>
        {value}
      </div>
      {sub && (
        <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-bone/55">
          {sub}
        </div>
      )}
      {accent && (
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-saffron-400/15 blur-3xl" />
      )}
    </motion.div>
  );
}
