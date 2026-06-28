'use client';

import { useEffect, useState } from "react"

// La página ProductPage se mantiene en cache por 7 días
// Este componente se usa para que esta sección no se mantenga
// en cache si cambia en algún momento.
// Esta misma estrategia se puede usar para cualquier elemento
// de ProductPage (price, sizes, etc)

import { useCartStore } from '@/store';
import { getStockBySlug } from "@/app/actions/products/getStockBySlug"
import { CartProduct, Product, Size } from '@/interfaces';
import { titleFont } from "@/config/fonts"
import { QuantitySelector, SizeSelector } from '@/components'

interface Props {
    product: Product
}

export const AddToCart = ({ product }: Props) => {

    const [stock, setStock] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const getStock = async () => {
        setIsLoading(true)
        const stock = await getStockBySlug(product.slug)
        setStock(stock);
        setIsLoading(false)
    }

    useEffect(() => {
        getStock()
    }, [])

    const addProductToCart = useCartStore(state => state.addProductToCart)

    const [selectedSize, setSelectedSize] = useState<Size | undefined>();
    const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
    const [addedToCart, setAddedToCart] = useState<boolean>(false);

    const productToCart: CartProduct = {
        id: product.id,
        image: product.images[0],
        price: product.price,
        quantity: selectedQuantity,
        size: selectedSize!,
        slug: product.slug,
        title: product.title,
    }

    const addToCart = () => {
        setAddedToCart(true);
        if (!selectedSize) {
            return;
        }

        addProductToCart(productToCart)

        // Una vez agregado al carrito,
        // reseteamos las elecciones
        setAddedToCart(false);
        setSelectedQuantity(1);
        setSelectedSize(undefined);
    }

    return (<>
        {isLoading ?
            <h3 className={`${titleFont.className} p-1 bg-gray-100 text-xl rounded antialiased animate-pulse`}>Checking stock...</h3>
            :
            <h3 className={"font-bold mb-2"}>
                {
                    (stock === 0) && <span className="line-through">Stock unavailable</span>
                }
            </h3>
        }

        {addedToCart && !selectedSize && <span className='mt-5 fade-in text-red-500'>Indique una talla por favor.</span>}
        {(stock > 1) &&
            <>
                <SizeSelector onSizeChanged={setSelectedSize} selectedSize={selectedSize} availableSizes={product.sizes} />
                <QuantitySelector maxQuantity={product.inStock} quantity={selectedQuantity} onQuantityChange={setSelectedQuantity} />
                <button onClick={addToCart} className="btn-primary my-5">add to cart</button>
            </>
        }
    </>)
}
