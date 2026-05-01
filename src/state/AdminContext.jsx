// Back-compat shim. The unified context now lives in AuthContext.jsx.
// Existing imports of `AdminProvider` / `useAdmin` continue to work.
export { AuthProvider as AdminProvider, useAuth as useAdmin } from './AuthContext';
