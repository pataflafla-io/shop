'use client';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cart/cart.store';
import { currencyFormat } from '@/utils/currencyFormat';
import { ProductImage } from '@/components/product/productImage/ProductImage';
import { QuantitySelector } from '@/components/product/quantitySelector/QuantitySelector';

export const ProductsInCart = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => setIsLoading(false), []);

  const productsInCart = useCartStore((state) => state.cart);
  const updateQuantityInCart = useCartStore((state) => state.updateProductQuantity);
  const removeProductFromCart = useCartStore((state) => state.removeProductFromCart);

  if (productsInCart.length === 0 && !isLoading) {
    redirect('/empty');
  }

  return (
    <>
      {!isLoading &&
        productsInCart.map((product) => (
          <div
            id={`${product.slug}-${product.size}`}
            key={`${product.slug}-${product.size}`}
            className="flex mb-5"
          >
            <ProductImage
              alt={product.title}
              className="mr-5 rounded-lg object-fill"
              height={120}
              src={product.image}
              width={80}
            />
            <div>
              <Link className="cursor-pointer" href={`/product/${product.slug}`}>
                <p className="font-bold text-lg">{`${product.title}(size: ${product.size})`}</p>
              </Link>
              <p>{`unit price: ${currencyFormat(product.price)}`}</p>
              <QuantitySelector
                onQuantityChange={(q) => updateQuantityInCart(product, q)}
                quantity={product.quantity}
              />
              <button
                onClick={() => removeProductFromCart(product)}
                className="text-brand-burnt-peach hover:underline mt-3"
              >
                remove
              </button>
            </div>
          </div>
        ))}
    </>
  );
};
