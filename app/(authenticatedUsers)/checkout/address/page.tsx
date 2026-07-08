// Es poco probable que aparezca un país nuevo
// ahí un cache bastante extenso (1 año expresaado en segundos)
export const revalidate = 31536000;

import { Title } from '@/components/ui';
import { AddressForm } from './ui/addressForm';
import { getACountries, getUserAddress } from '@/app/actions';
import { auth } from '@/auth.config';

export default async function CheckoutAdressPage() {

    const session = await auth();

    // En este punto de la aplicación el usuario existe
    const storedAddress = await getUserAddress(session!.user.id)
    const countries = await getACountries();

    return (
        <div className="flex flex-col sm:justify-center sm:items-center mb-30 px-10 sm:px-0">
            <div className="w-full xl:w-250 flex flex-col justify-center text-left">
                <Title title="Your address" subtitle="Where to deliver?" />
                <AddressForm countries={countries} userStoredAddress={storedAddress || {}} />
            </div>
        </div>
    );
}