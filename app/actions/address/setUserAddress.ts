'use server';

import type { Address } from "@/interfaces";
import prisma from "@/lib/prisma";
import { success } from "zod";

export const setUserAdddress = async (address: Address, userId: string) => {
    try {

        const savedAddress = createOrReplaceAddress(address, userId);
        return {
            success: true,
            address: savedAddress
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Address couldn't be stored"
        }
    }
}

const createOrReplaceAddress = async (address: Address, userId: string) => {
    try {

        // ¿existe esa dirección para ese ussuario?
        const storedAddress = await prisma.userAddress.findUnique({
            where: { userId }
        })

        const addressToSave = {

            firstName: address.firstName,
            lastName: address.lastName,
            address: address.address,
            address2: address.address2,
            zipCode: address.zipCode,
            city: address.city,
            phone: address.phone,

            // Relación
            countryId: address.country,
            userId: userId,
        }


        if (!storedAddress) {
            const createAddress = await prisma.userAddress.create({
                data: addressToSave
            })

            return createAddress;
        }

        const updatedAddress = await prisma.userAddress.update({
            where: {
                userId
            },
            data: addressToSave
        })

        return updatedAddress;

    } catch (error) {
        console.log(error)
        throw new Error("Address couldn't be stored.")
    }
}