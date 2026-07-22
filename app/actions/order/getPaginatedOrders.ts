'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

interface PaginationOptions {
  page?: number;
  take?: number;
}

export const getPaginatedOrders = async ({ page = 1, take = 12 }: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;
  if (isNaN(Number(take))) take = 10;

  try {
    const session = await auth();
    if (session?.user.role !== 'admin') {
      return {
        success: false,
        message: '',
      };
    }

    const [orders, countOrders] = await Promise.all([
      prisma.order.findMany({
        take: take,
        skip: (page - 1) * take,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          createdAt: true,
          isPaid: true,
          orderAddresses: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      await prisma.order.count(),
    ]);

    const orderPages = Math.ceil(countOrders / take);

    return {
      success: true,
      currentPage: page,
      totalPages: orderPages,
      orders: orders,
    };
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};
