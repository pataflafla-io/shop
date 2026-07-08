'use server'

import prisma from "@/lib/prisma";

export const deleteUserAddress = async (userId: string) => {
    try {

        await prisma.userAddress.delete({ where: { userId } })

        return {
            success: true,
            message: "Address was deleted."
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Address couldn't be deleted."
        }
    }
}