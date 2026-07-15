import type { Size } from '@/interfaces';
import clsx from 'clsx';

interface Props {
  selectedSize?: Size;
  availableSizes: Size[];
  onSizeChanged: (size: Size) => void;
}

export const SizeSelector = ({ selectedSize, availableSizes, onSizeChanged }: Props) => {
  return (
    <div>
      <h3 className="font-bold mb-2">Available sizes</h3>
      <div className="flex">
        {availableSizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeChanged(size)}
            className={clsx(
              'mx-2 p-2 rounded-md transition-all hover:text-white hover:bg-brand-seaweed text-lg',
              { 'text-white bg-brand-orange shadow-sm': size === selectedSize }
            )}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};
