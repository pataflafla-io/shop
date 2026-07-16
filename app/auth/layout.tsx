import { Suspense } from 'react';
import { Header } from '@/components/ui';
import { Loader } from '@/components/ui/loader/Loader';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<Loader />}>
        <div className="flex justify-center items-center px-5">{children}</div>
      </Suspense>
    </main>
  );
}
