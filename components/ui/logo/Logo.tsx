import Image from 'next/image';
import Link from 'next/link';
import { titleFont } from '@/config/fonts';

export const Logo = () => {
  return (
    <div>
      <Link className="flex items-center p-5" href="/">
        <Image
          alt="Logo de Pataflafla"
          className="mx-2"
          height={64}
          src="/imgs/logo.png"
          width={64}
        />
        <span className={`${titleFont.className} hidden sm:inline font-bold antialiased`}>
          demoshop
        </span>
        <span className={`${titleFont.className} hidden sm:inline antialiased`}>
          @pataflafla.io
        </span>
      </Link>
    </div>
  );
};
