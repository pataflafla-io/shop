'server actions';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getOrdersBySessionUser = async () => {
  try {
    const session = await auth();
    if (!session?.user) {
      throw 'You need to be logged in order to user this server action.';
    }

    const getOrders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
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
