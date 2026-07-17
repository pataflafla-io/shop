import { cacheLife } from 'next/cache';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getPaginatedProductsWithImages } from '@/app/actions/products/getPaginatedProductsWithImages';
import { ProductsGrid } from '@/components';
import { Gender } from '@/interfaces';
import { Pagination, Title } from '@/components/ui';

interface Props {
  params: {
    gender: string;
  };
  searchParams: {
    page?: string;
  };
}

const getPagination = async (page: number, gender: Gender) => {
  'use cache';
  // Mantiene en cache por 1 minuto
  cacheLife({ stale: 60 });
  return await getPaginatedProductsWithImages({ page: page, gender: gender });
};

export default async function GenderPage({ params, searchParams }: Props) {
  const { gender } = await params;
  const { page } = await searchParams;

  const pageNumber = page ? parseInt(page) : 1;
  const { products, totalPages } = await getPagination(pageNumber, gender as Gender);

  if (products.length === 0) redirect(`/gender/${gender}`);

  const label: Record<string, string> = {
    men: 'for men',
    women: 'for women',
    kids: 'for kids',
    unisex: 'unisex',
  };
  const subtitle: Record<string, string> = {
    men: 'Knits, pants, suits and more',
    women: 'Coats, jeans, skirts and more',
    kids: 'Dress, hoodies, tee shirt and more.',
  };

  const productsByGender = products.filter((product) => product.gender === gender);

  return (
    <Suspense>
      <Title title={`Clothes ${label[gender]}`} subtitle={subtitle[gender]} />
      <ProductsGrid products={productsByGender} />
      {totalPages > 1 && <Pagination totalPages={totalPages} />}
    </Suspense>
  );
}
