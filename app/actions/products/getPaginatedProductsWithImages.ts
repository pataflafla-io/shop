'use server';

import { Gender } from '@/app/generated/prisma/enums';
import prisma from '@/lib/prisma';

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  gender,
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;
  if (isNaN(Number(take))) take = 10;

  try {
    const [productsDB, countProducts] = await Promise.all([
      prisma.product.findMany({
        take: take,
        skip: (page - 1) * take,
        include: {
          productImages: {
            take: 2,
            select: {
              url: true,
            },
          },
        },
        where: { gender: gender },
      }),
      await prisma.product.count({ where: { gender: gender } }),
    ]);

    const productsPages = Math.ceil(countProducts / take);

    return {
      currentPage: page,
      totalPages: productsPages,
      products: productsDB.map((product) => ({
        ...product,
        images: product.productImages.map((image) => image.url),
      })),
    };
  } catch (error) {
    throw new Error('Oops! No contamos con productos para ese género.');
  }
};
