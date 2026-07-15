'use client';

import Link from 'next/link';
import { useCartStore } from '@/store';
import { useGenderSection } from '@/store/ui/genderSectiob.store';
import { IoCartOutline } from 'react-icons/io5';
import { useShallow } from 'zustand/react/shallow';

export const CounterCart = () => {
  const { totalItems } = useCartStore(useShallow((state) => state.getCartSummary()));
  const setCurrentGender = useGenderSection((store) => store.setCurrentGender);

  return (
    <Link
      onClick={() => setCurrentGender('')}
      href={totalItems > 0 ? '/cart' : '/empty'}
      className="mx-2"
    >
      <div className="relative">
        {totalItems > 0 && (
          <span className="bg-brand-seaweed fade-in absolute -top-2 -right-2 rounded-full px-1 text-xs font-bold text-white">
            {totalItems}
          </span>
        )}
        <IoCartOutline className="h-5 w-5" />
      </div>
    </Link>
  );
};
