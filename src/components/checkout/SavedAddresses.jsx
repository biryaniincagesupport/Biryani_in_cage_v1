import { Star, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

// Saved-address selector shown on Checkout when the user is signed in.
// Picking one fills the form fields; "New address" un-selects to allow
// manual entry.

export default function SavedAddresses({ addresses, selectedId, onSelect }) {
  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {addresses.map((a) => {
          const active = selectedId === a.id;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onSelect(a)}
              className={cn(
                'rounded-2xl border p-4 text-left transition',
                active
                  ? 'border-saffron-400/60 bg-saffron-400/5 shadow-neon-soft'
                  : 'border-saffron-400/15 bg-ink-900/60 hover:border-saffron-400/30',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm text-bone">{a.label || 'Address'}</span>
                {a.is_default && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-saffron-400/40 bg-saffron-400/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-saffron-200">
                    <Star size={9} className="fill-saffron-300" /> Default
                  </span>
                )}
              </div>
              <p className="mt-2 truncate text-sm text-bone/85">{a.line1}</p>
              <p className="mt-0.5 text-[11px] text-bone/50">PIN {a.pincode}{a.area ? ` · ${a.area}` : ''}</p>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onSelect(null)}
          className={cn(
            'rounded-2xl border border-dashed p-4 text-left transition',
            selectedId === null
              ? 'border-saffron-400/60 bg-saffron-400/5'
              : 'border-saffron-400/20 bg-ink-900/40 hover:border-saffron-400/40',
          )}
        >
          <div className="flex items-center gap-2 text-saffron-300">
            <Plus size={14} />
            <span className="font-display text-sm">New address</span>
          </div>
          <p className="mt-2 text-[11px] text-bone/50">Type below — optionally save it for next time.</p>
        </button>
      </div>
    </div>
  );
}
