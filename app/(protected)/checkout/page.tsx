import Link from 'next/link';
import { Title } from '@/components/ui';
import { PlaceOrder } from './ui/placeOrder';
import { ProductsInCart } from './ui/productsInCart';

export default function () {
  return (
    <div className="flex justify-center items-center mb-30 px-10 sm:px-0">
      <div className="flex flex-col w-250">
        <Title title="Check your order" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 m">
          <div className="flex flex-col mt-5">
            <Link href="/cart" className="underline mb-5">
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
