import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AlertsDrawer } from './components/AlertsDrawer';
import { Toaster } from './components/ui';
import { Home } from './pages/Home';
import { ProductPage } from './pages/ProductPage';
import { BasketPage } from './pages/BasketPage';
import { ServiceDetail, ServicesPage } from './pages/ServicesPage';
import { CouponsPage } from './pages/CouponsPage';
import { useRoute, useScrollReset } from './lib/router';

export default function App() {
  const { name, id } = useRoute();
  const [alertsOpen, setAlertsOpen] = useState(false);
  useScrollReset(`${name}/${id ?? ''}`);

  let page: React.ReactNode;
  switch (name) {
    case 'urun': page = <ProductPage key={id} id={id ?? ''} />; break;
    case 'market': page = <BasketPage />; break;
    case 'hizmetler': page = <ServicesPage />; break;
    case 'hizmet': page = <ServiceDetail key={id} id={id ?? ''} />; break;
    case 'kuponlar': page = <CouponsPage />; break;
    default: page = <Home />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }} className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[90] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        İçeriğe geç
      </a>
      <Header onOpenAlerts={() => setAlertsOpen(true)} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">{page}</main>
      <Footer />
      <AlertsDrawer open={alertsOpen} onClose={() => setAlertsOpen(false)} />
      <Toaster />
    </div>
  );
}
