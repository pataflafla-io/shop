import { cacheLife } from 'next/cache';
import { redirect } from 'next/navigation';
import { getPaginatedProductsWithImages } from '@/app/actions/products/getPaginatedProductsWithImages';
import { ProductsGrid } from '@/components/products/grid/ProductsGrid';
import { Pagination } from '@/components/ui/pagination/Pagination';
import { Title } from '@/components/ui/title/Title';

interface Props {
  searchParams: {
    page?: string;
  };
}

const getPagination = async (page: number) => {
  'use cache';
  // Mantiene en cache por 1 minuto
  cacheLife({ stale: 60 });
  return await getPaginatedProductsWithImages({ page: page });
};

export default async function Home({ searchParams }: Props) {
  const { page } = await searchParams;
  const pageNumber = page ? parseInt(page) : 1;
  const { products, totalPages } = await getPagination(pageNumber);

  if (products.length === 0) redirect('/');

  return (
    <>
      <Title title="Store" subtitle="All products!" />
      <ProductsGrid products={products} />
      {totalPages > 0 && <Pagination totalPages={totalPages} />}
    </>
  );
}
