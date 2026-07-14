'use client';

import { confirmPayPalPayment } from '@/app/actions/payments/confirmPayPalPayment';
import { updateTransaction } from '@/app/actions/payments/updateOrderTransaction';
// PayPalButtons documentation
// https://www.npmjs.com/package/@paypal/react-paypal-js
import {
  CreateOrderActions,
  CreateOrderData,
  OnApproveActions,
  OnApproveData,
} from '@paypal/paypal-js';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

interface Props {
  orderId: string;
  amount: string;
}

export const PayPalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      intent: 'CAPTURE',
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            currency_code: 'USD',
            value: `${amount}`,
          },
        },
      ],
    });

    updateTransaction(orderId, transactionId);
    return transactionId;
  };

  // Una vez terminada la vuelta en Paypal se ejecuta onApprove.
  // el método capture() devuelve, entre otros, el id, generado
  // del lado de PayPal, con el cual se puede comprobar si la
  // transacción fue pagada realmente a través de un
  // server action.
  const onApprove = async (data: OnApproveData, actions: OnApproveActions): Promise<void> => {
    const details = await actions.order?.capture();
    if (!details) {
      return;
    }

    const respon = await confirmPayPalPayment(details.id!);
    console.log(respon);
  };

  const onCancel = async () => {};

  if (isPending) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-300 rounded"></div>
        <div className="h-12 mt-4 bg-gray-300 rounded"></div>
      </div>
    );
  }
  return <PayPalButtons createOrder={createOrder} onApprove={onApprove} />;
};
