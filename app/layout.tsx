import type { Metadata } from "next";
import { inter } from "@/config/fonts"
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: '%s - pataflafla.io',
    default: 'home - pataflafla.io'
  },
  description: "Tienda de productos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
