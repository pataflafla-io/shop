import Image from 'next/image';
import Link from 'next/link';
import { Size } from '@/interfaces';
import { currencyFormat } from '@/utils';

interface Props {
  order: {
    quantity: number;
    price: number;
    size: Size;
    product: {
      title: string;
      slug: string;
      productImages: {
        url: string;
      }[];
    };
  }[];
}

export const OrderedItems = ({ order }: Props) => {
  return (
    <div>
      {order.map((item) => (
        <div key={`${item.product.slug}-${item.size}`} className="mb-5 flex">
          <Image
            alt={item.product.title}
            className="mr-5 rounded-lg"
            height={100}
            src={`/products/${item.product.productImages[0].url}`}
            width={100}
          />
          <div>
            <p className="mb-2 text-2xl">
              <Link href={`/product/${item.product.slug}`}>{item.product.title}</Link>
            </p>
            <p>
              {currencyFormat(item.price)} x {item.quantity}
            </p>
            <p className="font-bold">
              Subtotal: {currencyFormat(item.price * item.quantity)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
