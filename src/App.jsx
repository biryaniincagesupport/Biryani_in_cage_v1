import { Suspense, lazy, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingCTAs from '@/components/ui/FloatingCTAs';
import PageShell from '@/components/layout/PageShell';
import CartFab from '@/components/cart/CartFab';
import CartDrawer from '@/components/cart/CartDrawer';

// Public pages — lazy-loaded.
const Home     = lazy(() => import('@/pages/Home'));
const Menu     = lazy(() => import('@/pages/Menu'));
const About    = lazy(() => import('@/pages/About'));
const Contact  = lazy(() => import('@/pages/Contact'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Admin — separate chunk; only loaded when /admin is hit.
const AdminLogin      = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminLayout     = lazy(() => import('@/pages/admin/AdminLayout'));
const AdminGuard      = lazy(() => import('@/pages/admin/AdminGuard'));
const AdminDashboard  = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminOrders     = lazy(() => import('@/pages/admin/AdminOrders'));
const AdminCustomers  = lazy(() => import('@/pages/admin/AdminCustomers'));

function RouteFallback() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center pt-24">
      <div className="h-2 w-32 overflow-hidden rounded-full bg-ink-800">
        <div className="h-full w-1/2 animate-marquee-fast bg-saffron-400" />
      </div>
    </div>
  );
}

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      <PageShell>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/"          element={<Home />} />
            <Route path="/menu"      element={<Menu />} />
            <Route path="/about"     element={<About />} />
            <Route path="/contact"   element={<Contact />} />
            <Route path="/checkout"  element={<Checkout />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }
            >
              <Route index            element={<AdminDashboard />} />
              <Route path="orders"    element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageShell>
      {!isAdmin && (
        <>
          <Footer />
          <FloatingCTAs />
          <CartFab onOpen={() => setCartOpen(true)} />
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </>
      )}
    </>
  );
}
