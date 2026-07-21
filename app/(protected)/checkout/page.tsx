import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth.config';
import { Title } from '@/components/ui/title/Title';
import { PlaceOrder } from './ui/placeOrder';
import { ProductsInCart } from './ui/productsInCart';

export default async function () {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="flex justify-center items-center mb-20 px-10 sm:px-0">
      <div className="flex flex-col w-full">
        <Title title="Check your order" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 m">
          <div className="flex flex-col mt-5">
            <Link href="/cart" className="text-brand-burnt-peach hover:underline mb-5">
              Edit cart
            </Link>
            <ProductsInCart />
          </div>
          <PlaceOrder />
        </div>
      </div>
    </div>
  );
}
