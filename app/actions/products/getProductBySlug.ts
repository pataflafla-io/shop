'use server';

import prisma from '@/lib/prisma';

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findUnique({
      include: {
        productImages: true,
      },
      where: { slug },
    });

    if (!product) {
      return null;
    }

    return {
      ...product,
      images: product.productImages.map((image) => image.url),
    };
  } catch (error) {
    return null;
  }
};
