'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

interface PaginationOptions {
  page?: number;
  take?: number;
}

export const getPaginatedUsers = async ({ page = 1, take = 12 }: PaginationOptions) => {
  const session = await auth();

  if (session?.user.role !== 'admin') {
    return {
      success: false,
      message: 'You must be an admin user to use this action.',
    };
  }

  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;
  if (isNaN(Number(take))) take = 10;

  try {
    const [users, countUsers] = await Promise.all([
      prisma.user.findMany({
        orderBy: {
          name: 'desc',
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      }),
      await prisma.user.count(),
    ]);

    if (!users) {
      throw "Retrieving users couldn't be fetched";
    }

    const usersPages = Math.ceil(countUsers / take);

    return {
      success: true,
      currentPage: page,
      totalPages: usersPages,
      users: users,
    };
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};
