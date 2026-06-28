// En cache por 7 días
export const revalidate = 10080;

import { Metadata, ResolvingMetadata } from "next";
import { titleFont } from "@/config/fonts";
import { ProductMobileSlideShow, ProductSlideShow, StockLabel } from "@/components";
import { getProductBySlug } from "@/app/actions";
import { AddToCart } from "./ui/addToCart";

interface Props {
    params: {
        slug: string
    }
}

// Función para genera Metadata dinámica basada en el slug
// que llega por url.
// https://nextjs.org/docs/app/getting-started/metadata-and-og-images

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {

    const slug = (await params).slug

    const product = await getProductBySlug(slug)

    return {
        title: product.title,
        description: product.description || '',
        openGraph: {
            title: product.title,
            description: product.description || '',
            // Url absoluta
            images: [`/product/${product.images[0]}`]
        }
    }
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProductBySlug(slug)

    return (
        <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
            <div className="col-span-1 md:col-span-2">
                <ProductMobileSlideShow className="block sm:hidden" title={product.title} images={product.images} />
                <ProductSlideShow className="hidden sm:block" title={product.title} images={product.images} />
            </div>
            <div className="col-span-1 px-5">
                <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>{product.title}</h1>
                <p className="text-lg mb-5">${product.price}</p>
                <AddToCart product={product} />
                <h3 className="font-black text-sm">Description</h3>
                <p className="font-light">{product.description}</p>
            </div>
        </div>
    );
}