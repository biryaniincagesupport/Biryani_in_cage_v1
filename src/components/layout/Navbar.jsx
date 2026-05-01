import { useEffect, useRef, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu as MenuIcon, X, Phone, User, LogOut, ClipboardList } from 'lucide-react';
import { NAV, SITE } from '@/data/site';
import { cn } from '@/utils/cn';
import { useAuth } from '@/state/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-saffron-400/15 bg-ink-950/85 backdrop-blur-lg shadow-plate'
            : 'bg-transparent',
        )}
      >
        <div className="container-x flex h-[68px] items-center justify-between">
          <Link to="/" className="group flex items-center gap-2.5" aria-label={SITE.name}>
            <CageLogo className="h-8 w-8 text-saffron-400 transition-transform duration-500 group-hover:rotate-[8deg]" />
            <div className="leading-tight">
              <div className="font-display text-base sm:text-lg font-bold tracking-wider text-bone">
                Biryani <span className="italic text-saffron-300">In Cage</span>
              </div>
              <div className="hidden text-[10px] uppercase tracking-[0.3em] text-saffron-400/70 sm:block">
                Deoghar · since 2021
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'group relative rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-colors',
                    isActive ? 'text-saffron-300' : 'text-bone/80 hover:text-saffron-200',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3 -bottom-0.5 h-px bg-saffron-400 shadow-[0_0_8px_rgba(255,198,40,0.7)]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href={`tel:${SITE.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 rounded-full border border-saffron-400/30 px-3 py-1.5 text-xs text-saffron-200 transition hover:border-saffron-400 hover:text-saffron-100"
            >
              <Phone size={13} /> {SITE.phone}
            </a>
            {auth.isAuthed ? (
              <UserMenu auth={auth} />
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="btn-ghost !px-4 !py-2 text-xs"
              >
                <User size={13} /> Sign in
              </button>
            )}
            <Link to="/menu" className="btn-primary !px-5 !py-2 text-sm">
              View Menu
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-saffron-400/30 bg-ink-900/60 text-saffron-200 md:hidden"
          >
            {open ? <X size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-ink-950/95 backdrop-blur-md" onClick={() => setOpen(false)} />
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="container-x relative flex min-h-screen flex-col justify-center pt-24"
            >
              <ul className="flex flex-col gap-2">
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'block border-b border-saffron-400/10 py-5 font-display text-4xl tracking-wide',
                          isActive ? 'neon-text' : 'text-bone/85',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-3">
                {auth.isAuthed ? (
                  <Link to="/account" onClick={() => setOpen(false)} className="btn-primary justify-start !px-6">
                    <User size={16} /> My account
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setOpen(false); setAuthOpen(true); }}
                    className="btn-primary justify-start !px-6"
                  >
                    <User size={16} /> Sign in
                  </button>
                )}
                <a href={`tel:${SITE.phone.replace(/\s+/g, '')}`} className="btn-ghost justify-start !px-6">
                  <Phone size={16} /> Call · {SITE.phone}
                </a>
                <a href={SITE.links.zomato} target="_blank" rel="noopener noreferrer" className="btn-dark justify-start !px-6">
                  Order on Zomato
                </a>
                <a href={SITE.links.swiggy} target="_blank" rel="noopener noreferrer" className="btn-dark justify-start !px-6">
                  Order on Swiggy
                </a>
              </div>

              <p className="mt-12 text-xs uppercase tracking-[0.4em] text-saffron-400/50">
                Deoghar · Jharkhand
              </p>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

function UserMenu({ auth }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const initial = (auth.email || '?')[0].toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="grid h-9 w-9 place-items-center rounded-full border border-saffron-400/40 bg-saffron-400/10 text-sm font-display text-saffron-200 transition hover:border-saffron-400 hover:text-saffron-100"
      >
        {initial}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-2xl border border-saffron-400/20 bg-ink-900 p-1 shadow-plate"
          >
            <div className="px-3 py-2.5 border-b border-saffron-400/10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-saffron-400/70">
                Signed in
              </p>
              <p className="mt-1 truncate text-sm text-bone">{auth.email}</p>
            </div>
            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-bone/85 hover:bg-saffron-400/10"
            >
              <ClipboardList size={13} /> My account
            </Link>
            {auth.isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-saffron-300 hover:bg-saffron-400/10"
              >
                <User size={13} /> Admin dashboard
              </Link>
            )}
            <button
              type="button"
              onClick={async () => { await auth.signOut(); setOpen(false); }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-bone/70 hover:bg-saffron-400/10 hover:text-red-300"
            >
              <LogOut size={13} /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CageLogo({ className }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <rect x="2" y="2" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <line x1="9" y1="6" x2="9" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="6" x2="14" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="6" x2="19" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="6" x2="24" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="16" r="3.2" fill="currentColor" />
    </svg>
  );
}
