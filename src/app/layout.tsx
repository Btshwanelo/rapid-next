// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from 'next/image';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rapid Code",
  description: "A rapid ideation tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}>
        {/* Background Image */}
        <div className="fixed inset-0 -z-10">
          <Image
            src={'/images/body-background.webp'}
            alt="Background"
            fill
            priority
            className="object-cover"
            quality={100}
          />
          {/* Dark overlay */}
          {/* <div className="absolute inset-0 bg-[#0A0A29]/90 backdrop-blur-sm" /> */}
        </div>
        
        {/* Content */}
        <div className="relative z-0">
          {children}
        </div>
      </body>
    </html>
  );
}