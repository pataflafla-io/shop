'use client'

import { useEffect, useState } from "react"
import { useCartStore } from "@/store"
import { currencyFormat } from "@/utils"

export const CartSummary = () => {
    // Trick para evitar problemas de rehydratrion
    // datdo que Zustand persite desde el lado del
    // cliente, pero la página se renderiza del lado
    // del servidor
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => setIsLoading(false), [])
    const subTotal = useCartStore(state => state.getSummarySubtotal());
    const total = useCartStore(state => state.getSummaryTotal());
    const tax = useCartStore(state => state.getSummaryTax());
    const totalItems = useCartStore(state => state.getTotalItens());

    if (isLoading) return;
    return (
        <>
            <h2 className="text-2xl mb-2">Your order summary</h2>
            <div className="grid grid-cols-2">
                <span>Number of products</span>
                <span className="text-right">{`${totalItems} ${totalItems === 1 ? 'articulo' : 'artículos'}`}</span>

                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subTotal)}</span>

                <span>Taxes (15%)</span>
                <span className="text-right">{currencyFormat(tax)}</span>

                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>

            </div>
        </>
    )
}

