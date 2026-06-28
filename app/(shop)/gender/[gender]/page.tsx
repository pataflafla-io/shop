// Mantiene en cache por 1 minuto
export const revalidate = 60;

import { redirect } from "next/navigation";

import { Gender } from "@/interfaces";
import { getPaginatedProductsWithImages } from "@/app/actions/products/pagination";
import { ProductsGrid } from '@/components';
import { Pagination, Title } from '@/components/ui';

interface Props {
    params: {
        gender: string,

    },
    searchParams: {
        page?: string,
    }
}

export default async function GenderPage({ params, searchParams }: Props) {
    const { gender } = await params;
    const { page } = await searchParams;

    const pageNumber = page ? parseInt(page) : 1
    const { products, totalPages } = await getPaginatedProductsWithImages({ page: pageNumber, gender: gender as Gender })

    if (products.length === 0) redirect(`/gender/${gender}`)

    const label: Record<string, string> = {
        "men": "for men",
        "women": "for women",
        "kids": "for kids",
        "unisex": "unisex"
    }
    const subtitle: Record<string, string> = {
        "men": "Knits, pants, suits and more",
        "women": "Coats, jeans, skirts and more",
        "kids": "Dress, hoodies, tee shirt and more."
    }

    const productsByGender = products.filter(product => product.gender === gender)

    return (
        <>
            <Title title={`Clothes ${label[gender]}`} subtitle={subtitle[gender]} />
            <ProductsGrid products={productsByGender} />
            {totalPages > 1 &&
                <Pagination totalPages={totalPages} />
            }
        </>
    );
}