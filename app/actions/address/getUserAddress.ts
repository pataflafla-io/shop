'use server'

import prisma from "@/lib/prisma";

export const getUserAddress = async (userId: string) => {
    try {

        const address = await prisma.userAddress.findUnique({
            where: {
                userId
            }
        })

        if (!address) return {};

        return {
            ...address,
            // TS y Prisma manejan los opcionales de forma diferente
            // por eso "la pisada"
            address2: address.address2 || ''
        }


    } catch (error) {
        console.log(error);
        return null
    }
}