'use server';

import prisma from '@/lib/prisma';

export const getUserAddress = async (userId: string) => {
  try {
    const address = await prisma.userAddress.findUnique({
      where: {
        userId,
      },
    });

    if (!address) return null;

    // La relación en la bd se hace a través de countryId
    // useForm tiene como fieldName country.
    // ¿Podría renombrar el field countryId en el form?
    // Si, pero no resulta semántico.
    const { countryId, ...restAddress } = address;

    return {
      ...restAddress,
      // TS y Prisma manejan los opcionales de forma diferente
      // por eso "la pisada"
      address2: restAddress.address2 || '',
      country: countryId,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
