'use client';

import Link from 'next/link';
import { titleFont } from '@/config/fonts';

export const Footer = () => {
  return (
    <div className="fade-in flex w-full justify-center text-md mb-10">
      <Link href="https://www.pataflafla.io/" target="_blank">
        <span className={`${titleFont.className} antialiased font-bold`}>pataflafla</span>
        <span className={`${titleFont.className} antialiased`}>.io</span>
        <span>&nbsp;|&nbsp;©{new Date().getFullYear()}</span>
      </Link>
    </div>
  );
};
