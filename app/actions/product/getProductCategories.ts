'use server';

import prisma from '@/lib/prisma';

export const getProductCategories = async (): Promise<
  {
    id: string;
    name: string;
  }[]
> => {
  try {
    const getCategories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    if (!getCategories) {
      throw "There's not categories.";
    }
    return getCategories;
  } catch (error) {
    return [];
  }
};
