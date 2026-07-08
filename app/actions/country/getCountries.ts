'use server'

import { Country } from "@/interfaces"
import prisma from "@/lib/prisma"

export const getACountries = async (): Promise<Country[]> => {
    try {
        const countries = await prisma.country.findMany({
            orderBy: {
                name: 'asc'
            }
        })

        return countries

    } catch (error) {
        return []
    }
}