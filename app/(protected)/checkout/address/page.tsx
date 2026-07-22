import { cacheLife } from 'next/cache';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getUserAddress } from '@/app/actions/address/getUserAddress';
import { getACountries } from '@/app/actions/country/getCountries';
import { auth } from '@/auth.config';
import { Address } from '@/interfaces/address.interface';
import { Loader } from '@/components/ui/loader/Loader';
import { Title } from '@/components/ui/title/Title';
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
  if (!session?.user) {
    redirect('/auth/login');
  }

  const storedAddress = (await getUserAddress(session!.user.id)) || ({} as Address);
  const countries = await getCountries();
  return (
    <Suspense fallback={<Loader />}>
      <div className="flex flex-col sm:justify-center sm:items-center mb-20 px-10 sm:px-0">
        <div className="w-full flex flex-col justify-center text-left">
          <Title title="Delivery address" subtitle="and who is receiving the purchase?" />
          <AddressForm countries={countries} userStoredAddress={storedAddress} />
        </div>
      </div>
    </Suspense>
  );
}
