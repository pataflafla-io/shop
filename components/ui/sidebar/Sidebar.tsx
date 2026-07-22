'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { titleFont } from '@/config/fonts';
import { useAddressStore } from '@/store/address/address.store';
import { useCartStore } from '@/store/cart/cart.store';
import { useUIStore } from '@/store/ui/sidebar.store';
import clsx from 'clsx';
import { signIn, signOut, useSession } from 'next-auth/react';
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoShirtOutline,
  IoTicketOutline,
} from 'react-icons/io5';

export const Sidebar = () => {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const router = useRouter();

  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const closeSidebar = useUIStore((state) => state.closeSidebar);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearAddress = useAddressStore((state) => state.clearAddress);

  const handleSignout = async () => {
    await signOut({ callbackUrl: '/' });
    clearCart();
    clearAddress();
    closeSidebar();
  };

  return (
    <div>
      {isSidebarOpen && (
        <div className="fixed z-10 top-0 left-0 w-full h-screen bg-black opacity-50" />
      )}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fade-in fixed z-10 top-0 left-0 w-full h-screen backdrop-filter backdrop-blur-xs"
        />
      )}
      <nav
        className={clsx(
          'fixed z-20 top-0 right-0 p-5 w-100 h-screen bg-white shadow-2xl transition-all duration-300',
          { 'translate-x-full': !isSidebarOpen }
        )}
      >
        <div className="flex justify-between items-center">
          <p>
            <span className={`${titleFont.className} font-bold text-2xl antialiased`}>
              demoshop
            </span>
          </p>

          <IoCloseOutline
            className="hover:scale-75 rounded-lg hover:bg-black hover:text-white transition-all duration-300"
            size={40}
            onClick={closeSidebar}
          />
        </div>
        {!isAuthenticated && (
          <button
            onClick={() => signIn()}
            className="w-full flex items-center p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoLogInOutline size={20} />
            <span className="ml-3 text-xl">Sign in</span>
          </button>
        )}

        {session?.user.role === 'user' && (
          <>
            <Link
              href="/profile"
              onClick={() => closeSidebar()}
              className="flex items-center w-full mt-5 p-2 rounded-lg hover:bg-black hover:text-white transition-all duration-300"
            >
              <IoPersonOutline size={20} />
              <span className="ml-3 text-xl">Your profile</span>
            </Link>
            <Link
              href="/orders"
              onClick={() => closeSidebar()}
              className="flex items-center w-full p-2 rounded-lg hover:bg-black hover:text-white transition-all duration-300"
            >
              <IoTicketOutline size={20} />
              <span className="ml-3 text-xl">Your orders</span>
            </Link>
          </>
        )}
        {session?.user.role === 'admin' && (
          <>
            <Link
              href="/admin/orders"
              onClick={() => closeSidebar()}
              className="flex items-center p-2 w-full rounded-lg hover:bg-black hover:text-white transition-all duration-300"
            >
              <IoTicketOutline size={20} />
              <span className="ml-3 text-xl">Everyone's orders</span>
            </Link>

            <Link
              href="/admin/products"
              onClick={() => closeSidebar()}
              className="flex items-center w-full p-2 rounded-lg hover:bg-black hover:text-white transition-all duration-300"
            >
              <IoShirtOutline size={20} />
              <span className="ml-3 text-xl">Products manteinance</span>
            </Link>
            <Link
              href="/admin/users"
              onClick={() => closeSidebar()}
              className="flex items-center p-2 w-full rounded-lg hover:bg-black hover:text-white transition-all duration-300"
            >
              <IoPeopleOutline size={20} />
              <span className="ml-3 text-xl">Users management</span>
            </Link>
          </>
        )}

        <div className="w-full h-px bg-gray-200 my-5" />

        <button
          onClick={handleSignout}
          className="flex items-center w-full p-2 rounded-lg hover:bg-black hover:text-white transition-all duration-300"
        >
          <IoLogOutOutline size={20} />
          <span className="ml-3 text-xl">Sign out</span>
        </button>
      </nav>
    </div>
  );
};
