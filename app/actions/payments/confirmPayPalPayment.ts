'use server';

import { revalidatePath } from 'next/cache';
import { PayPalResponse } from '@/interfaces/paypal.interface';
import prisma from '@/lib/prisma';

// Server Action responsable de realizar un fetch
// contra PayPal para confirmar si la transacción
// fue pagada correctamente.
// Recordar que se puede manipular dicha respuesta
// desde el frontend.
export const confirmPayPalPayment = async (transactionId: string) => {
  const token = await getAccessToken();
  if (!token) {
    return {
      success: false,
      message: 'Access token failed',
    };
  }
  const statusResponse = await getStatusOrder(token, transactionId);
  if (!statusResponse) {
    return {
      success: false,
      message: 'Error al verificar estado de pago',
    };
  }

  const { status, purchase_units } = statusResponse;
  if (status !== 'COMPLETED') {
    return {
      success: false,
      message: 'Orden aún no paga',
    };
  }

  // En la respuesta de PayPal se nos devuevle el orderId
  // que le envíamos.
  // ¿Se puede obtener desde el frontend?
  // Si, claro! Pero de nuevo, alguien con conocimientos
  // podría manipular el frontend y hacer pasar como que
  // la orden ya fue paga.
  const invoice_id = purchase_units[0].invoice_id;
  // ACTUALIZAR BD
  try {
    const updateOrder = await prisma.order.update({
      where: {
        id: invoice_id,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

    if (!updateOrder) {
      return {
        success: false,
        message: 'Error al actualizar la orden',
      };
    }

    revalidatePath('/orders/');
    revalidatePath(`/orders/${invoice_id}`);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al actualizar la orden',
    };
  }
};

// Método usado para obtener el accesss token desde
// endpoint público de PayPal.
// El código fue generado por PostMan (¡qué cracks!)
// Hice una ligero cambio aprovechando el async.
const getAccessToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const base64Token = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`, 'utf-8').toString(
    'base64'
  );
  const oauth2TokenUrl = process.env.PAYPAL_OAUTH_URL ?? '';

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Authorization', `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append('grant_type', 'client_credentials');

  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: urlencoded,
  };

  try {
    const response = await fetch(oauth2TokenUrl, {
      ...requestOptions,
      cache: 'no-store',
    }).then((response) => response.json());

    return response.access_token;
  } catch (error) {
    return null;
  }
};

// Método usado para obtener el status de una
// orden desde el endpoint de PayPal, el cual
// necesita un access token y el número de orden.
// Nuevamente, el siguiente código fue generado por
// PostMan (¡ídolos!)
// Sólo hice algunos micros ajustes aprovechando
// el async.
const getStatusOrder = async (
  accesstToken: string,
  orderId: string
): Promise<PayPalResponse | null> => {
  const checkout_orders_url = process.env.PAYPAL_ORDERS_URL ?? '';
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${accesstToken}`);

  const requestOptions = {
    method: 'GET',
    headers: headers,
  };

  try {
    const response = await fetch(`${checkout_orders_url}/${orderId}`, {
      ...requestOptions,
      cache: 'no-store',
    }).then((response) => response.json());
    console.log('RESPONSE', response);
    return response;
  } catch (error) {
    return null;
  }
};
