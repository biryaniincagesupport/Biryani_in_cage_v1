import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/state/AdminContext';

// Wraps the admin area. Bounces unauth'd visitors to /admin/login and
// shows a "not allowed" notice for signed-in users who aren't on the
// allowlist.

export default function AdminGuard({ children }) {
  const admin = useAdmin();

  if (!admin.configured) {
    return <Navigate to="/admin/login" replace />;
  }

  if (admin.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <div className="h-2 w-32 overflow-hidden rounded-full bg-ink-800">
          <div className="h-full w-1/2 animate-marquee-fast bg-saffron-400" />
        </div>
      </div>
    );
  }

  if (!admin.isAuthed) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!admin.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="glass-card max-w-md p-8 text-center">
          <p className="section-eyebrow text-red-300">Access denied</p>
          <h1 className="mt-3 font-display text-2xl text-bone">
            <em className="not-italic">{admin.email}</em> isn't on the admin allowlist.
          </h1>
          <p className="mt-4 text-sm text-bone/65">
            Add this email to <code className="text-saffron-200">VITE_ADMIN_EMAILS</code>{' '}
            and the <code className="text-saffron-200">is_admin()</code> function in
            <code className="text-saffron-200"> supabase/schema.sql</code>, then sign in again.
          </p>
          <button
            type="button"
            onClick={() => admin.signOut()}
            className="btn-ghost mt-6"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return children;
}
