import { titleFont } from '@/config/fonts';

interface Props {
  title: string;
  subtitle?: string;
  className?: string;
}

export const Title = ({ title, subtitle, className }: Props) => {
  return (
    <div className={`mt-3 ${className}`}>
      <h1 className={`${titleFont.className} antialiased text-3xl font-semibold`}>{title}</h1>
      {subtitle && <h2 className="text-xl mb-10">{subtitle}</h2>}
    </div>
  );
};
