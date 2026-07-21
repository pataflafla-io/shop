'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { setPlaceOrder } from '@/app/actions/order/setPlaceOrder';
import { useAddressStore } from '@/store/address/address.store';
import { useCartStore } from '@/store/cart/cart.store';
import { currencyFormat } from '@/utils/currencyFormat';
import clsx from 'clsx';
import { useShallow } from 'zustand/react/shallow';

export const PlaceOrder = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const router = useRouter();

  const hasHydrated = useAddressStore((state) => state._hasHydrated);
  const addressStore = useAddressStore((state) => state.address);

  const itemsInCart = useCartStore((store) => store.cart);
  const clearCart = useCartStore((store) => store.clearCart);

  // La data expuesta acá está expresada por lo que se encuentra
  // en el localStorage (zustand); y dado qué es sensible a
  // manipulación desde la UI entonces sólo se usa a efectos
  // visuales, no es la que que se usará para realizar el
  // pedido en el backend.
  // En la store del cart hay información sobre useShallow
  const { subTotal, tax, total, totalItems } = useCartStore(
    useShallow((state) => state.getCartSummary())
  );

  const onPlaceOrder = async () => {
    // Deshabilitamos el botón de "Place your order"
    // para evitar posibles doble click y generar
    // multiples órdenes.
    setIsOrderPlaced(true);

    // Del store, lo único que se envía al backend para
    // tramitar el pedido es el id, la quantity y el size.
    const preparedOrder = itemsInCart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      size: item.size,
    }));

    const placedOrder = await setPlaceOrder(preparedOrder, addressStore);
    if (!placedOrder.success) {
      setErrorMessage(placedOrder.message);
      return;
    }

    clearCart();
    setIsOrderPlaced(false);
    router.replace(`/orders/${placedOrder.order!.id}`);
  };

  const onTransactionError = () => {
    setErrorMessage('');
    setIsOrderPlaced(false);
    router.replace('/cart');
  };

  return (
    <div className="rounded-xl bg-white p-7 shadow-xl">
      {hasHydrated && (
        <>
          <h2 className="mb-2 text-2xl font-bold">Delivery address</h2>
          <div className="mb-10">
            <p className="text-xl">
              {addressStore.firstName} {addressStore.lastName}
            </p>
            <p>{addressStore.address}</p>
            <p>{addressStore.zipCode}</p>
            <p>
              {addressStore.city}, {addressStore.country}
            </p>
            <p>{addressStore.phone}</p>
          </div>

          <div className="h-0.5 w-full rounded" />
          <h2 className="mb-2 text-2xl">Purchase summary</h2>
          <div className="grid grid-cols-2">
            <span>Number of products</span>
            <span className="text-right">{`${totalItems} ${totalItems === 1 ? 'articulo' : 'artículos'}`}</span>

            <span>Subtotal</span>
            <span className="text-right">{currencyFormat(subTotal)}</span>

            <span>Taxes (15%)</span>
            <span className="text-right">{currencyFormat(tax)}</span>

            <span className="mt-5 text-2xl">Total:</span>
            <span className="mt-5 text-right text-2xl">{currencyFormat(total)}</span>
          </div>
          <div className="mt-5 mb-2 w-full">
            <p className="mb-5">
              <span className="text-sm">
                By clicking "Place your Order," you agree to our Terms and Conditions of Use and
                Privacy Policy.
              </span>
            </p>

            <button
              disabled={isOrderPlaced}
              onClick={onPlaceOrder}
              className={clsx(
                {
                  'btn-primary flex w-full justify-center sm:w-fit': !isOrderPlaced,
                },
                {
                  'btn-secondary flex w-full justify-center sm:w-fit': isOrderPlaced,
                }
              )}
            >
              {!isOrderPlaced
                ? 'Place your order'
                : errorMessage
                  ? "Your order couldn't be processed"
                  : 'Your order has been placed'}
            </button>
            {errorMessage && (
              <p className="fade-in border-brand-burnt-peach text-brand-burnt-peach mt-4 mb-2 border-2 p-2">
                {errorMessage}
              </p>
            )}
            {errorMessage && (
              <p>
                Please update your{' '}
                <button
                  className="text-brand-burnt-peach hover:underline"
                  onClick={onTransactionError}
                >
                  order
                </button>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
