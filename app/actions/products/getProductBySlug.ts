'use server'

import prisma from "@/lib/prisma"

export const getProductBySlug = async (slug: string) => {
    try {
        const product = await prisma.product.findUnique({
            include: {
                productImages: {
                    select: {
                        url: true
                    }
                }
            },
            where: { slug }
        })

        if (!product) throw new Error("😩 No contamos con ese producto");

        return {
            ...product,
            images: product.productImages.map(image => image.url)
        }

    } catch (error) {
        throw new Error("😩 No contamos con ese producto")
    }
}