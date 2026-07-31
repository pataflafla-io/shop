'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useUIStore } from '@/store/ui/sidebar.store';
import { useSession } from 'next-auth/react';
import { CounterCart } from '@/components/ui/counterCart/CounterCart';
import { Logo } from '@/components/ui/logo/Logo';
import { CategoriesMenu } from '@/components/ui/navigation/CategoriesMenu';

export const NavigationWithCategories = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => setIsHydrated(true), []);

  const session = useSession();
  const user = session.data?.user;

  const openSidebar = useUIStore((state) => state.openSidebar);

  return (
    <nav className="flex w-full items-center justify-between sm:px-5">
      <Logo />
      <div className="hidden sm:block">
        <CategoriesMenu />
      </div>

      <div className="flex items-center">
        {isHydrated && <CounterCart />}
        <button
          onClick={openSidebar}
          className="sm:hidden m-2 rounded-md p-2 hover:bg-black hover:text-white transition-all duration-300"
        >
          menu
        </button>

        {user ? (
          <button
            onClick={openSidebar}
            className="hidden sm:block m-2 rounded-md p-2 hover:bg-black hover:text-white transition-all duration-300"
          >
            menu
          </button>
        ) : (
          <Link
            className="hidden sm:block m-2 rounded-md p-2 hover:bg-black hover:text-white transition-all duration-300"
            href="/auth/login"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
};
