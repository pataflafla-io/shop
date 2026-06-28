// Mantiene en cache por 1 minuto
export const revalidate = 60;

import { redirect } from 'next/navigation';

import { ProductsGrid } from '@/components';
import { Pagination, Title } from '@/components/ui';
import { getPaginatedProductsWithImages } from '../actions';

interface Props {
  searchParams: {
    page?: string,
  }
}

export default async function Home({ searchParams }: Props) {
  const { page } = await searchParams
  const pageNumber = page ? parseInt(page) : 1
  const { products, totalPages } = await getPaginatedProductsWithImages({ page: pageNumber })

  if (products.length === 0) redirect("/")

  return (

    <>
      <Title title="Store" subtitle="All products" />
      <ProductsGrid products={products} />
      {totalPages > 0 &&
        <Pagination totalPages={totalPages} />
      }
    </>

  );
}
