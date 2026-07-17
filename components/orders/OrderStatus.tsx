import clsx from 'clsx';
import { IoCartOutline } from 'react-icons/io5';

interface Props {
  isPaid: boolean;
}

export const OrderStatus = ({ isPaid }: Props) => {
  return (
    <div
      className={clsx('tex-xs mb-5 flex items-center rounded-lg px-3.5 py-2 font-bold text-white', {
        'bg-green-700': isPaid,
        'bg-red-700': !isPaid,
      })}
    >
      <IoCartOutline size={30} />
      <span className="mx-2">{isPaid ? 'Pagada' : 'Pendiente'}</span>
    </div>
  );
};
