'use cache';

import { cacheLife } from 'next/cache';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getProductBySlug } from '@/app/actions/products/getProductBySlug';
import { titleFont } from '@/config/fonts';
import { Metadata, ResolvingMetadata } from 'next';
import { ProductMobileSlideShow } from '@/components/product/slideshow/ProductMobileSlideshow';
import { ProductSlideShow } from '@/components/product/slideshow/ProductSlideshow';
import { Loader } from '@/components/ui/loader/Loader';
import { AddToCart } from './ui/addToCart';

interface Props {
  params: {
    slug: string;
  };
}

// Función para genera Metadata dinámica basada en el slug
// que llega por url.
// https://nextjs.org/docs/app/getting-started/metadata-and-og-images

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;

  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product not found',
      description: '',
    };
  }

  return {
    title: product.title,
    description: product.description || '',
    openGraph: {
      title: product.title,
      description: product.description || '',
      // Url absoluta
      images: [`/product/${product.images[0]}`],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  // En cache por 7 días
  cacheLife({ stale: 10080 });

  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <Suspense fallback={<Loader />}>
      <div className="mb-20 grid md:grid-cols-3 gap-3">
        <div className="col-span-1 md:col-span-2">
          <ProductMobileSlideShow
            className="block sm:hidden"
            title={product.title}
            images={product.images}
          />
          <ProductSlideShow
            className="hidden sm:block"
            title={product.title}
            images={product.images}
          />
        </div>
        <div className="col-span-1 px-5">
          <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
            {product.title}
          </h1>
          <p className="text-lg mb-5">${product.price}</p>
          <AddToCart product={product} />
          <h3 className="font-black text-sm">Description</h3>
          <p className="font-light">{product.description}</p>
        </div>
      </div>
    </Suspense>
  );
}
