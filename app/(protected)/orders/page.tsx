import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getOrdersBySessionUser } from '@/app/actions/order/getOrdersBySessionUser';
import { auth } from '@/auth.config';
import { IoCardOutline } from 'react-icons/io5';
import { Title } from '@/components/ui';

export default async function () {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/login');
  }

  const { orders } = await getOrdersBySessionUser();

  return (
    <>
      <Title title="Your orders" />
      <div className="mt-6 mb-20 overflow-hidden rounded-lg shadow-xl">
        <table className="min-w-full">
          <thead className="border-b border-gray-200 bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                #ID
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Who receives?
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Purchase date
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Is paid?
              </th>
            </tr>
          </thead>
          <tbody>
            {!orders ? (
              <tr className="border-b border-gray-200 bg-white transition duration-300 ease-in-out hover:bg-gray-100">
                <td
                  colSpan={4}
                  className="text-center px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900"
                >
                  <p>You haven't orders.</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-200 bg-white transition duration-300 ease-in-out hover:bg-gray-100"
                >
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                    <Link href={`/orders/${order.id}`}>{order.id}</Link>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                    {order.orderAddresses?.firstName} {order.orderAddresses?.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm font-light whitespace-nowrap text-gray-900">
                    {order.createdAt.toDateString()}
                  </td>
                  <td className="flex items-center px-6 py-4 text-sm font-light whitespace-nowrap text-gray-900">
                    {order.isPaid ? (
                      <>
                        <IoCardOutline className="text-green-800" />
                        <span className="mx-2 text-green-800">Paid</span>
                      </>
                    ) : (
                      <>
                        <IoCardOutline className="text-red-800" />
                        <span className="mx-2 text-red-800">Not paid</span>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
