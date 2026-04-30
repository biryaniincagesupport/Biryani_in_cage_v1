import { Suspense, lazy, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingCTAs from '@/components/ui/FloatingCTAs';
import PageShell from '@/components/layout/PageShell';
import CartFab from '@/components/cart/CartFab';
import CartDrawer from '@/components/cart/CartDrawer';

// Lazy-loaded routes — keeps the initial JS bundle small.
const Home     = lazy(() => import('@/pages/Home'));
const Menu     = lazy(() => import('@/pages/Menu'));
const About    = lazy(() => import('@/pages/About'));
const Contact  = lazy(() => import('@/pages/Contact'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const NotFound = lazy(() => import('@/pages/NotFound'));

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

  return (
    <>
      <Navbar />
      <PageShell>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageShell>
      <Footer />
      <FloatingCTAs />
      <CartFab onOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
