'use client';

import { useEffect, useState } from 'react';
import { getStockBySlug } from '@/app/actions/products/getStockBySlug';
import { titleFont } from '@/config/fonts';

// La página ProductPage se mantiene en cache por 7 días
// Este componente se usa para que esta sección no se mantenga
// en cache si cambia en algún momento.
// Esta misma estrategia se puede usar para cualquier elemento
// de ProductPage (price, sizes, etc)

interface Props {
  slug: string;
}
export const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getStock = async () => {
    setIsLoading(true);
    const stock = await getStockBySlug(slug);
    setStock(stock);
    setIsLoading(false);
  };

  useEffect(() => {
    getStock();
  }, []);

  return (
    <>
      {isLoading ? (
        <h3
          className={`${titleFont.className} p-1 bg-gray-200 text-xl rounded antialiased animate-pulse`}
        >
          &nbsp;
        </h3>
      ) : (
        <h3 className={'font-bold'}>
          {stock > 1 ? <span>Stock: available</span> : <span className="line-through">Stock</span>}
        </h3>
      )}
    </>
  );
};
