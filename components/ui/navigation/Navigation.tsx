'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUIStore } from '@/store/ui/sidebar.store';
import { useSession } from 'next-auth/react';
import { CounterCart } from '@/components/ui/counterCart/CounterCart';
import { Logo } from '@/components/ui/logo/Logo';

export const Navigation = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => setIsHydrated(true), []);

  const session = useSession();
  const user = session.data?.user;
  const isAdmin = user?.role === 'admin';

  const openSidebar = useUIStore((state) => state.openSidebar);
  return (
    <nav className="flex w-full items-center justify-between sm:px-5">
      <Logo />
      <div className="flex items-center">
        {isHydrated && !isAdmin && <CounterCart />}

        <button
          onClick={openSidebar}
          className="m-2 rounded-md p-2 hover:bg-black hover:text-white transition-all duration-300"
        >
          menu
        </button>
      </div>
    </nav>
  );
};
