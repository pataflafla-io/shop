'use server';

import prisma from '@/lib/prisma';

export const removeUserAddress = async (userId: string) => {

  try {
    await prisma.userAddress.delete({ where: { userId } });

    return {
      success: true,
      message: 'Address was deleted.',
    };
  } catch (error) {
    return {
      success: false,
      message: "Address couldn't be deleted.",
    };
  }
};
