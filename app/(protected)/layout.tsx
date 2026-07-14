import { Suspense } from 'react';
import { Footer, Header } from '@/components/ui';
import { Loader } from '@/components/ui/loader/Loader';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<Loader />}>
        <Header />
        <div className="sm:px-10">{children}</div>
        <Footer />
      </Suspense>
    </main>
  );
}
