import { cacheLife } from 'next/cache';
import { Suspense } from 'react';
import { getACountries, getUserAddress } from '@/app/actions/server';
import { auth } from '@/auth.config';
import { Address } from '@/interfaces';
import { Title } from '@/components/ui';
import { AddressForm } from './ui/addressForm';

const getCountries = async () => {
  'use cache';

  // Es muy poco probable, hasta deseable, que
  // no aparezcan países nuevos en 1 año.
  cacheLife({ stale: 31536000 });
  return await getACountries();
};

export default async function CheckoutAdressPage() {
  const session = await auth();

  // En este punto de la aplicación el usuario existe
  const storedAddress = (await getUserAddress(session!.user.id)) || ({} as Address);
  const countries = await getCountries();
  return (
    <Suspense fallback="CARGAND">
      <div className="flex flex-col sm:justify-center sm:items-center mb-30 px-10 sm:px-0">
        <div className="w-full xl:w-250 flex flex-col justify-center text-left">
          <Title title="Delivery address" subtitle="and who is receiving the purchase?" />
          <AddressForm countries={countries} userStoredAddress={storedAddress} />
        </div>
      </div>
    </Suspense>
  );
}
