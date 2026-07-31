'use client';

import Link from 'next/link';
import { titleFont } from '@/config/fonts';

export const Footer = () => {
  return (
    <div className="fade-in flex flex-col items-center w-full justify-center text-md mb-10">
      <Link href="https://www.pataflafla.io/" target="_blank">
        <span className={`${titleFont.className} antialiased font-bold`}>pataflafla</span>
        <span className={`${titleFont.className} antialiased`}>.io</span>
        <span>&nbsp;|&nbsp;©{new Date().getFullYear()}</span>
      </Link>
      <p className="p-5 sm:p-0">
        <span className="font-bold">Important</span>: You're running in a live demo environment,
        because of that, some features are disabled.
      </p>
    </div>
  );
};
