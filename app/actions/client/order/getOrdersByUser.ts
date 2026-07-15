'server actions';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { UserAddress } from '../../generated/prisma/browser';

export const getOrdersBySessionUser = async () => {
  try {
    const session = await auth();
    if (!session?.user) {
      throw 'Session not found';
    }

    const getOrders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        NOT: {
          user: {
            role: 'admin',
          },
        },
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
    });
    console.log(getOrders);
    if (!getOrders) {
      throw `${session.user.name} hasn't orders yet.`;
    }

    return {
      success: true,
      orders: getOrders,
    };
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};
