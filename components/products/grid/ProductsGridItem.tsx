'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/interfaces/product.interface';
import { currencyFormat } from '@/utils/currencyFormat';

interface Props {
  product: Product;
}

export const ProductsGridItem = ({ product }: Props) => {
  const [displayImage, setDisplayImage] = useState(product.images[0]);
  return (
    <div className="rounded-md overflow-hidden fade-in">
      <Link href={`/product/${product.slug}`} prefetch={false}>
        <Image
          alt={product.title}
          className="w-full object-cover rounded-md"
          height={500}
          loading="lazy"
          onMouseEnter={() => setDisplayImage(product.images[1])}
          onMouseLeave={() => setDisplayImage(product.images[0])}
          src={`/products/${displayImage}`}
          width={500}
        />
      </Link>
      <div className="flex flex-col p-4">
        <Link className="hover:underline text-xl antialiased" href={`/product/${product.slug}`}>
          {product.title}
        </Link>
        <span className="font-bold">{currencyFormat(product.price)}</span>
      </div>
    </div>
  );
};
