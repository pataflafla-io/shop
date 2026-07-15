'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getOrderById = async (id: string) => {
  const session = await auth();
  if (!session) {
    return {
      success: false,
      message: 'Session not found.',
    };
  }

  try {
    // Prisma ofrece traer los campos de la tabla con la que está relacionado, así como los
    // campos que deseamos. A golpe de vista resulta abrumador, después de un rato viene el
    // "ahhhh mirá que bien que está!"
    // Se puede lograr lo mismo haciendo varias consultas; y me parece (debatible), es más
    // legibile (o entendible)
    // @todo: investigar qué opción es más performante.
    // Doc: https://www.prisma.io/docs/orm/prisma-client/queries/select-fields
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderAddresses: true,
        orderItems: {
          select: {
            price: true,
            quantity: true,
            size: true,
            product: {
              select: {
                title: true,
                slug: true,
                productImages: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw `The order ${id} doesn't exists.`;
    }

    if (session.user.role === 'user') {
      if (session.user.id !== order.userId) {
        throw `Order ${id} don't belong to the current user.`;
      }
    }

    // El campo opcional es Prisma se maneja diferente al campo opcional en TS.
    // por eso la pisada.
    const { orderAddresses, ...restOrder } = order;
    const { address2, countryId, ...restAddress } = orderAddresses!;
    const address = {
      ...restAddress,
      address2: address2 || '',
      country: countryId,
    };

    const orderWithTSInterfaceCompatibility = {
      ...restOrder,
      address,
    };

    return {
      success: true,
      result: orderWithTSInterfaceCompatibility,
    };
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};
