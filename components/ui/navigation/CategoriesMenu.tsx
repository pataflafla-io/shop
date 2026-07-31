import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useGenderSection } from '@/store/ui/genderSection.store';
import { useUIStore } from '@/store/ui/sidebar.store';
import clsx from 'clsx';

export const CategoriesMenu = () => {
  const { gender } = useParams();
  const currentGender = useGenderSection((store) => store.selectedGender);
  const setCurentGender = useGenderSection((store) => store.setCurrentGender);
  const closeSidebar = useUIStore((store) => store.closeSidebar);

  useEffect(() => {
    closeSidebar();
    setCurentGender(gender);
  }, [gender]);

  return (
    <>
      <Link
        className={clsx(
          'hover:bg-brand-dark-cyan m-2 rounded-md p-2 transition-all hover:text-white duration-300',
          { 'bg-black sm:bg-brand-orange text-white': currentGender === 'men' }
        )}
        href="/gender/men"
      >
        <span className="ml-3 sm:ml-0 text-xl">Men</span>
      </Link>
      <Link
        className={clsx(
          'hover:bg-brand-dark-cyan m-2 rounded-md p-2 transition-all hover:text-white duration-300',
          { 'bg-black sm:bg-brand-orange text-white': currentGender === 'women' }
        )}
        href="/gender/women"
      >
        <span className="ml-3 sm:ml-0 text-xl">Women</span>
      </Link>
      <Link
        className={clsx(
          'hover:bg-brand-dark-cyan m-2 rounded-md p-2 transition-all hover:text-white duration-300',
          { 'bg-black sm:bg-brand-orange text-white': currentGender === 'kids' }
        )}
        href="/gender/kids"
      >
        <span className="ml-3 sm:ml-0 text-xl">Kids</span>
      </Link>
    </>
  );
};
