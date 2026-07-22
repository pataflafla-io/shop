import { Suspense } from 'react';
import { Toaster } from 'sonner';
import { Footer } from '@/components/ui/footer/Footer';
import { Loader } from '@/components/ui/loader/Loader';
import { Navigation } from '@/components/ui/navigation/Navigation';
import { Sidebar } from '@/components/ui/sidebar/Sidebar';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<Loader />}>
        <Navigation />
        <Sidebar />
        <div className="sm:px-15">{children}</div>
        <Footer />
        <Toaster
          toastOptions={{
            classNames: {
              icon: '[&_svg]:text-white [&_svg]:fill-emerald-700',
            },
          }}
        />
      </Suspense>
    </main>
  );
}
