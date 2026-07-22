'use client';

import { useCartStore } from '@/store/cart/cart.store';
import { currencyFormat } from '@/utils/currencyFormat';
import { useShallow } from 'zustand/react/shallow';

export const CartSummary = () => {
  const { subTotal, total, totalItems, tax } = useCartStore(
    useShallow((state) => state.getCartSummary())
  );
  const hasHydrated = useCartStore((state) => state._hasHydrated);
  return (
    <>
      <h2 className="text-2xl mb-2">Your order summary</h2>
      <div className="grid grid-cols-2">
        {hasHydrated && (
          <>
            <span>Number of products</span>
            <span className="text-right">{`${totalItems} ${totalItems === 1 ? 'articulo' : 'artículos'}`}</span>

            <span>Subtotal</span>
            <span className="text-right">{currencyFormat(subTotal)}</span>

            <span>Taxes (15%)</span>
            <span className="text-right">{currencyFormat(tax)}</span>

            <span className="mt-5 text-2xl">Total:</span>
            <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
          </>
        )}
      </div>
    </>
  );
};
