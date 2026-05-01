import { motion } from 'framer-motion';

// Lightweight SVG bar+line combo. No chart library dep — keeps the bundle
// small and the visuals on-brand. Bars = orders/day, line = revenue.

export default function DailyChart({ series }) {
  const maxRev = Math.max(1, ...series.map((d) => d.revenue));
  const maxOrd = Math.max(1, ...series.map((d) => d.orders));

  const W = 1000;     // viewBox width
  const H = 280;      // viewBox height
  const PADX = 36;
  const PADY = 24;
  const innerW = W - PADX * 2;
  const innerH = H - PADY * 2;

  const xFor = (i) => PADX + (i + 0.5) * (innerW / series.length);
  const barWidth = (innerW / series.length) * 0.55;

  // Line coordinates for revenue
  const linePts = series
    .map((d, i) => `${xFor(i).toFixed(2)},${(PADY + innerH - (d.revenue / maxRev) * innerH).toFixed(2)}`)
    .join(' ');

  return (
    <div className="rounded-3xl border border-saffron-400/15 bg-ink-900/60 p-6 backdrop-blur">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-saffron-400/70">
            Last {series.length} days
          </p>
          <h3 className="mt-1 font-display text-xl text-bone">Daily orders &amp; revenue</h3>
        </div>
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-bone/60">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-saffron-400" /> orders
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded bg-emerald-400" /> revenue
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 h-64 w-full" preserveAspectRatio="none">
        {/* horizontal grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => (
          <line
            key={p}
            x1={PADX}
            x2={W - PADX}
            y1={PADY + innerH * p}
            y2={PADY + innerH * p}
            stroke="rgba(245,184,0,0.08)"
            strokeWidth="1"
          />
        ))}

        {/* order bars */}
        {series.map((d, i) => {
          const h = (d.orders / maxOrd) * innerH;
          const x = xFor(i) - barWidth / 2;
          const y = PADY + innerH - h;
          return (
            <motion.rect
              key={d.date}
              x={x}
              y={y}
              width={barWidth}
              height={h}
              rx="3"
              fill="url(#barGrad)"
              initial={{ height: 0, y: PADY + innerH }}
              animate={{ height: h, y }}
              transition={{ duration: 0.5, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
            />
          );
        })}

        {/* revenue line */}
        <motion.polyline
          fill="none"
          stroke="#34D399"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={linePts}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* revenue dots */}
        {series.map((d, i) => (
          <circle
            key={`dot-${d.date}`}
            cx={xFor(i)}
            cy={PADY + innerH - (d.revenue / maxRev) * innerH}
            r="3"
            fill="#34D399"
            stroke="#0C0A09"
            strokeWidth="1.5"
          />
        ))}

        {/* x-axis labels */}
        {series.map((d, i) =>
          i % Math.ceil(series.length / 7) === 0 || i === series.length - 1 ? (
            <text
              key={`lbl-${d.date}`}
              x={xFor(i)}
              y={H - 4}
              textAnchor="middle"
              fontSize="10"
              fill="rgba(245,241,232,0.55)"
            >
              {d.label}
            </text>
          ) : null,
        )}

        <defs>
          <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFC628" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFC628" stopOpacity="0.35" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
