import Image from 'next/image';
import Link from 'next/link';
import { titleFont } from '@/config/fonts';

export const Header = () => {
  return (
    <nav className="flex px-5 justify-center items-center w-full">
      <div>
        <Link className="flex items-center p-5" href="/">
          <Image
            alt="Logo de Pataflafla"
            className="mx-2"
            height={64}
            src="/imgs/logo.png"
            width={64}
          />
          <span className={`${titleFont.className} antialiased font-bold`}>pataflafla</span>
          <span className={`${titleFont.className} antialiased`}>.io</span>
        </Link>
      </div>
    </nav>
  );
};
