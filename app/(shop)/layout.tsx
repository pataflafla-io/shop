import { Suspense } from 'react';
import { Toaster } from 'sonner';
import { Footer, Sidebar, TopMenu } from '@/components/ui';
import { Loader } from '@/components/ui/loader/Loader';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<Loader />}>
        <TopMenu />
        <Sidebar />
        <div className="sm:px-10">{children}</div>
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
