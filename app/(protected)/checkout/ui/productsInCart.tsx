'use client'

import Image from 'next/image'
import { redirect } from 'next/navigation'
import { useCartStore } from "@/store"
import { currencyFormat } from '@/utils'

export const ProductsInCart = () => {

    const productsInCart = useCartStore(state => state.cart)
    return (
        <>
            {productsInCart.map(product => (
                <div id={`${product.slug}-${product.size}`} key={`${product.slug}-${product.size}`} className="flex mb-5">
                    <Image
                        alt={product.title}
                        className="mr-5 rounded"
                        height={100}
                        src={`/products/${product.image}`}
                        width={100}
                    />
                    <div>
                        <p className='font-bold text-lg'>{`${product.title}(size: ${product.size})`}</p>
                        <p>{`unit price: ${currencyFormat(product.price)}`}</p>
                        <p>{`quantity: ${product.quantity}`}</p>
                        <p className='mt-4 font-bold'>{currencyFormat((product.price * product.quantity))}</p>
                    </div>
                </div>
            ))
            }
        </>
    )
}
