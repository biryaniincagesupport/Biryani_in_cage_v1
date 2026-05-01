import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from '@/state/AdminContext';
import { cn } from '@/utils/cn';

const NAV_ITEMS = [
  { to: '/admin',           label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders',    label: 'Orders',    icon: ClipboardList },
  { to: '/admin/customers', label: 'Customers', icon: Users },
];

export default function AdminLayout() {
  const admin = useAdmin();
  const navigate = useNavigate();

  const onSignOut = async () => {
    await admin.signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-saffron-400/10 bg-ink-900/60 p-6 backdrop-blur md:flex">
          <Link to="/admin" className="block">
            <div className="font-display text-lg text-bone">
              Biryani <span className="italic text-saffron-300">In Cage</span>
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-saffron-400/70">
              Admin · Console
            </div>
          </Link>

          <nav className="mt-10 flex flex-1 flex-col gap-1">
            {NAV_ITEMS.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                className={({ isActive }) =>
                  cn(
                    'group inline-flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                    isActive
                      ? 'bg-saffron-400/10 text-saffron-200 shadow-neon-soft'
                      : 'text-bone/70 hover:bg-saffron-400/5 hover:text-bone',
                  )
                }
              >
                <it.icon size={14} />
                <span className="font-medium tracking-wide">{it.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-saffron-400/10 pt-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-saffron-400/60">
              Signed in
            </p>
            <p className="mt-1 truncate text-sm text-bone">{admin.email}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs text-bone/60 hover:text-saffron-300"
              >
                <ExternalLink size={12} /> Public site
              </Link>
              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex items-center gap-2 text-xs text-bone/60 hover:text-red-300"
              >
                <LogOut size={12} /> Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Mobile header */}
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-saffron-400/10 bg-ink-950/85 p-4 backdrop-blur md:hidden">
            <Link to="/admin" className="font-display text-base text-bone">
              <span className="italic text-saffron-300">Admin</span> · BIC
            </Link>
            <button
              type="button"
              onClick={onSignOut}
              className="rounded-full border border-saffron-400/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-bone/70"
            >
              Sign out
            </button>
          </header>

          {/* Mobile tabs */}
          <nav className="flex gap-1 overflow-x-auto border-b border-saffron-400/10 bg-ink-900/60 px-3 py-2 md:hidden">
            {NAV_ITEMS.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                className={({ isActive }) =>
                  cn(
                    'shrink-0 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition',
                    isActive
                      ? 'border-saffron-400 bg-saffron-400 text-ink-950'
                      : 'border-saffron-400/20 text-bone/70',
                  )
                }
              >
                {it.label}
              </NavLink>
            ))}
          </nav>

          <motion.main
            key={typeof window !== 'undefined' ? window.location.pathname : ''}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="px-5 py-8 sm:px-8 lg:px-10"
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  );
}
