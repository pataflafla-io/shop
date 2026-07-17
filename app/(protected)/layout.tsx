import { Suspense } from 'react';
import { Footer, Navigation, Sidebar } from '@/components/ui';
import { Loader } from '@/components/ui/loader/Loader';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<Loader />}>
        <Navigation />
        <Sidebar />
        <div className="sm:px-15">{children}</div>
        <Footer />
      </Suspense>
    </main>
  );
}
