'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const updateTransaction = async (orderId: string, transactionId: string) => {
  try {
    const session = await auth();
    if (!session) {
      return {
        sucess: false,
        message: "There's no session",
      };
    }

    const updateTransaction = await prisma.order.update({
      where: {
        id: orderId,
        AND: {
          userId: session.user.id,
        },
      },
      data: {
        transactionId: transactionId,
      },
    });

    if (!updateTransaction) {
      return {
        success: false,
        message: "Transaction couldn't be saved.",
      };
    }

    return {
      success: true,
      message: 'Transaction saved!',
    };
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};
