'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { titleFont } from '@/config/fonts';
import { useGenderSection } from '@/store/ui/genderSection.store';
import { useUIStore } from '@/store/ui/sidebar.store';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { CounterCart } from '@/components/ui/counterCart/CounterCart';

export const NavigationWithCategories = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => setIsHydrated(true), []);

  const session = useSession();
  const user = session.data?.user;

  const openSidebar = useUIStore((state) => state.openSidebar);

  const { gender } = useParams();
  const currentGender = useGenderSection((store) => store.selectedGender);
  const setCuurentGender = useGenderSection((store) => store.setCurrentGender);
  useEffect(() => setCuurentGender(gender), [gender]);

  return (
    <nav className="flex w-full items-center justify-between px-5">
      <div>
        <Link className="flex items-center p-5" href="/" onClick={() => setCuurentGender('')}>
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
      {
        <div className="hidden sm:block">
          <Link
            className={clsx(
              'hover:bg-brand-seaweed m-2 rounded-md p-2 transition-all hover:text-white duration-300',
              { 'bg-brand-orange text-white': currentGender === 'men' }
            )}
            href="/gender/men"
          >
            men
          </Link>
          <Link
            className={clsx(
              'hover:bg-brand-seaweed m-2 rounded-md p-2 transition-all hover:text-white duration-300',
              { 'bg-brand-orange text-white': currentGender === 'women' }
            )}
            href="/gender/women"
          >
            women
          </Link>
          <Link
            className={clsx(
              'hover:bg-brand-seaweed m-2 rounded-md p-2 transition-all hover:text-white duration-300',
              { 'bg-brand-orange text-white': currentGender === 'kids' }
            )}
            href="/gender/kids"
          >
            kids
          </Link>
        </div>
      }
      <div className="flex items-center">
        {isHydrated && <CounterCart />}
        {user ? (
          <button
            onClick={openSidebar}
            className="m-2 rounded-md p-2 hover:bg-black hover:text-white transition-all duration-300"
          >
            menu
          </button>
        ) : (
          <Link
            className="m-2 rounded-md p-2 hover:bg-black hover:text-white transition-all duration-300"
            href="/auth/login"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
};
