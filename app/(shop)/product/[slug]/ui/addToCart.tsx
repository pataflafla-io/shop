'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStockBySlug } from '@/app/actions/products/getStockBySlug';
import { titleFont } from '@/config/fonts';
import { CartProduct, Product, Size } from '@/interfaces/product.interface';
import { useCartStore } from '@/store/cart/cart.store';
import { useGenderSection } from '@/store/ui/genderSection.store';
import { toast } from 'sonner';
import { QuantitySelector } from '@/components/product/quantitySelector/QuantitySelector';
import { SizeSelector } from '@/components/product/sizeSelector/SizeSelector';

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {
  const [stock, setStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getStock = async () => {
    setIsLoading(true);
    const stock = await getStockBySlug(product.slug);
    setStock(stock);
    setIsLoading(false);
  };

  const setStore = useGenderSection((state) => state.setCurrentGender);
  useEffect(() => setStore(product.gender), []);

  useEffect(() => {
    getStock();
  }, []);

  const addProductToCart = useCartStore((state) => state.addProductToCart);

  const [selectedSize, setSelectedSize] = useState<Size | undefined>();
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  const productToCart: CartProduct = {
    id: product.id,
    image: product.images[0],
    price: product.price,
    quantity: selectedQuantity,
    size: selectedSize!,
    slug: product.slug,
    title: product.title,
  };

  const addToCart = () => {
    setAddedToCart(true);
    if (!selectedSize) {
      return;
    }

    addProductToCart(productToCart);

    // Una vez agregado al carrito,
    // reseteamos las elecciones
    setAddedToCart(false);
    setSelectedQuantity(1);
    setSelectedSize(undefined);
    toast.success(
      <div>
        {product.title} was added to the <Link href="/cart">cart</Link>
      </div>
    );
  };

  return (
    <>
      {isLoading ? (
        <h3
          className={`${titleFont.className} p-1 bg-gray-100 text-xl rounded antialiased animate-pulse`}
        >
          Checking stock...
        </h3>
      ) : (
        <h3 className={'font-bold mb-2'}>
          {stock <= 0 && <span className="line-through">Stock unavailable</span>}
        </h3>
      )}

      {stock >= 1 && (
        <>
          <SizeSelector
            onSizeChanged={setSelectedSize}
            selectedSize={selectedSize}
            availableSizes={product.sizes}
          />
          {addedToCart && !selectedSize && (
            <span className="fade-in text-brand-burnt-peach">Select a size, please.</span>
          )}
          <QuantitySelector
            maxQuantity={product.inStock}
            quantity={selectedQuantity}
            onQuantityChange={setSelectedQuantity}
          />
          <button onClick={addToCart} className="btn-primary my-5">
            add to cart
          </button>
        </>
      )}
    </>
  );
};
