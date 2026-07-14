import { Address } from '@/interfaces';
import { currencyFormat } from '@/utils';

interface Props {
  address: Address;
  subTotal: number;
  tax: number;
  total: number;
  totalItems: number;
}

export const OrderDetail = ({ address, subTotal, tax, total, totalItems }: Props) => {
  const {
    firstName,
    lastName,
    address: home,
    address2,
    zipCode,
    city,
    country,
    phone,
  } = address;

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold">Delivery address</h2>
      <div className="mb-10">
        <p className="text-xl">
          {firstName} {lastName}
        </p>
        <p>{home}</p>
        <p>{address2}</p>
        <p>{zipCode}</p>
        <p>
          {city}, {country}
        </p>
        <p>{phone}</p>
      </div>

      <div className="h-0.5 w-full rounded" />

      <h2 className="mb-2 text-2xl">Purchase summary</h2>
      <div className="grid grid-cols-2">
        <span>Number of products</span>
        <span className="text-right">{`${totalItems} ${totalItems === 1 ? 'articulo' : 'artículos'}`}</span>
        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>
        <span>Taxes (23%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>
        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-right text-2xl">{currencyFormat(total)}</span>
      </div>
    </div>
  );
};
