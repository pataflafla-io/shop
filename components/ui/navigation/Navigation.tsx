'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { titleFont } from '@/config/fonts';
import { useUIStore } from '@/store/ui/sidebar.store';
import { useSession } from 'next-auth/react';
import { CounterCart } from '@/components/ui/counterCart/CounterCart';

export const Navigation = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => setIsHydrated(true), []);

  const session = useSession();
  const user = session.data?.user;
  const isAdmin = user?.role === 'admin';

  const openSidebar = useUIStore((state) => state.openSidebar);

  const { gender } = useParams();

  return (
    <nav className="flex w-full items-center justify-between px-5">
      <div>
        <Link className="flex items-center p-5" href="/">
          <Image
            alt="Logo de Pataflafla"
            className="mx-2"
            height={64}
            src="/imgs/logo.png"
            width={64}
          />
          <span className={`${titleFont.className} font-bold antialiased`}>demoshop</span>
          <span className={`${titleFont.className} antialiased`}>@pataflafla.io</span>
        </Link>
      </div>
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
