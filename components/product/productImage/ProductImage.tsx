import Image from 'next/image';

interface Props {
  alt: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
  height: number;
  src?: string;
  style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
  width: number;
}

export const ProductImage = ({ alt, className, height, src, style, width }: Props) => {
  const imageSrc = src
    ? src.startsWith('http')
      ? src
      : `/products/${src}`
    : '/imgs/placeholder.jpg';
  return (
    <Image
      alt={alt}
      className={className}
      height={width}
      src={imageSrc}
      style={style}
      width={height}
    />
  );
};
