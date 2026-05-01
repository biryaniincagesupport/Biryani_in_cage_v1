import { STATUS_LABELS, STATUS_TONE } from '@/api/admin';

const TONE_CLASSES = {
  amber:   'border-amber-400/40   bg-amber-400/10   text-amber-200',
  sky:     'border-sky-400/40     bg-sky-400/10     text-sky-200',
  violet:  'border-violet-400/40  bg-violet-400/10  text-violet-200',
  saffron: 'border-saffron-400/40 bg-saffron-400/10 text-saffron-200',
  emerald: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
  red:     'border-red-400/40     bg-red-400/10     text-red-200',
};

export default function StatusBadge({ status, size = 'md' }) {
  const tone = STATUS_TONE[status] ?? 'sky';
  const label = STATUS_LABELS[status] ?? status;
  const sizeCls = size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${TONE_CLASSES[tone]} ${sizeCls} font-display uppercase tracking-[0.2em]`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
