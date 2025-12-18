// app/layout.tsx - SATU-SATUNYA ROOT LAYOUT
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./../globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pempek 7 Ulu - Order Online",
  description: "Order pempek terbaik dari Palembang",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://i.imgur.com" />
        <link rel="dns-prefetch" href="https://i.imgur.com" />
      </head>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}