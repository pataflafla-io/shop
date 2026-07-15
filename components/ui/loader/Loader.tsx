import Image from 'next/image';
import { titleFont } from '@/config/fonts';

export const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <div className="flex items-center">
        <Image
          alt="Logo de Pataflafla"
          className="mx-2"
          height={64}
          src="/imgs/logo.png"
          width={64}
        />
        <div className="flex flex-col">
          <div>
            <span className={`${titleFont.className} antialiased font-bold`}>pataflafla</span>
            <span className={`${titleFont.className} antialiased`}>.io</span>
          </div>
          <p className={`${titleFont.className} antialiased`}>Loading...</p>
        </div>
      </div>
    </div>
  );
};
