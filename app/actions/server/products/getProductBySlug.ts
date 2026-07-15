'use server';

import prisma from '@/lib/prisma';

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findUnique({
      include: {
        productImages: {
          select: {
            url: true,
          },
        },
      },
      where: { slug },
    });

    if (!product) {
      // Vercel no expone, afortunadamente, errores al
      // frontend.
      //throw new Error("No contamos con ese producto");
      return false;
    }

    return {
      ...product,
      images: product.productImages.map((image) => image.url),
    };
  } catch (error) {
    throw new Error('😩 No contamos con ese producto');
  }
};
