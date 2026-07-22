import type { Size } from '@/interfaces/product.interface';
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
        {availableSizes.map((size) => {
          const isSelected = size === selectedSize;
          return (
            <button
              key={size}
              onClick={() => onSizeChanged(size)}
              className={clsx(
                'mx-2 p-2 border cursor-pointer rounded-md transition-all text-lg',
                {
                  'hover:text-white hover:bg-brand-seaweed ': !isSelected,
                },
                {
                  'text-white border-brand-orange bg-brand-orange shadow-sm': isSelected,
                }
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};
