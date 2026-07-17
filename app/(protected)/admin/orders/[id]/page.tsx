import { redirect } from 'next/navigation';
import { getOrderById } from '@/app/actions/order/getOrderById';
import { OrderDetail, OrderedItems, OrderStatus } from '@/components/orders';
import { Title } from '@/components/ui';

interface Props {
  params: {
    id: string;
  };
}

export default async function ({ params }: Props) {
  const { id } = await params;

  const { success, result } = await getOrderById(id);
  if (!success) {
    redirect('/');
  }

  // Si bien el el address está definido como opcional en la bd,
  // en este punto siempre debería de existir una; de lo contrario,
  // ¿a dónde se realizó el envío?
  const address = result!.address;

  // ... lo mismo con el resto de propiedades que vienen en la orden;
  // el server action se encargó de realizar las validaciones
  // correspondientes.
  const { itemsToOrder, subtotal, tax, total, orderItems, isPaid } = result!;

  return (
    <div className="mb-20 flex items-center justify-center px-10 sm:px-0">
      <div className="flex flex-col p-7 w-full rounded-xl bg-white shadow-xl ">
        <Title title={`Order #${id}`} />
        <div className="mt-5 grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div className="mt-1 flex flex-col">
            <OrderStatus isPaid={isPaid ?? false} />
            <OrderedItems order={orderItems} />
          </div>
          <div>
            <OrderDetail
              address={address}
              subTotal={subtotal}
              tax={tax}
              total={total}
              totalItems={itemsToOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
