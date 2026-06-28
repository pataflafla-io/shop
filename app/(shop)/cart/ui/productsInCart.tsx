'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCartStore } from "@/store"
import { QuantitySelector } from '@/components'
import { currencyFormat } from '@/utils'
import { redirect } from 'next/navigation'

export const ProductsInCart = () => {
    // Trick para evitar problemas de rehydratrion
    // datdo que Zustand persite desde el lado del
    // cliente, pero la página se renderiza del lado
    // del servidor
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => setIsLoading(false), [])

    const productsInCart = useCartStore(state => state.cart)
    const updateQuantityInCart = useCartStore(state => state.updateProductQuantity)
    const removeProductFromCart = useCartStore(state => state.removeProductFromCart)

    if (productsInCart.length === 0) {
        redirect('/empty')
    }

    return (
        <>
            {!isLoading && productsInCart.map(product => (
                <div key={`${product.slug}-${product.size}`} className="flex mb-5">
                    <Image
                        alt={product.title}
                        className="mr-5 rounded"
                        height={100}
                        src={`/products/${product.image}`}
                        width={100}
                    />
                    <div>
                        <Link className='cursor-pointer' href={`/product/${product.slug}`}>
                            <p>{`${product.title}(size: ${product.size})`}</p>
                        </Link>
                        <p className='mb-2'>{currencyFormat(product.price)}</p>
                        <QuantitySelector onQuantityChange={(q) => updateQuantityInCart(product, q)} quantity={product.quantity} />
                        <button onClick={() => removeProductFromCart(product)} className="text-brand-burnt-peach hover:underline mt-3">remove</button>
                    </div>
                </div>
            ))
            }
        </>
    )
}
