import { ProductsGrid } from '@/components';
import { Title } from '@/components/ui';

import { initialData } from '@/seed/seed';
const products = initialData.products

export default function Home() {
  return (

    <>
      <Title title="Tienda" subtitle="Todos los productos" />
      <ProductsGrid products={products} />
    </>

  );
}
