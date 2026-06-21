import { notFound } from "next/navigation";
import { ProductsGrid } from '@/components';
import { Title } from '@/components/ui';

import { initialData } from '@/seed/seed';
import { Category } from "@/interfaces";
import { isKeyObject } from "util/types";
const products = initialData.products

interface Props {
    params: {
        id: Category
    }
}
export default async function ({ params }: Props) {
    const { id } = await params;

    const categoryType = ["men", "women", "kid", "unisex"]
    if (!categoryType.includes(id)) {
        notFound();
    }

    const label: Record<Category, string> = {
        "men": "para hombres",
        "women": "para mujeres",
        "kid": "para niños",
        "unisex": "unisex"
    }

    const productsByCategory = products.filter(product => product.gender === id)

    return (
        <>
            <Title title={`Artículos ${label[id]}`} subtitle="Todos los productos." />
            <ProductsGrid products={productsByCategory} />
        </>
    );
}