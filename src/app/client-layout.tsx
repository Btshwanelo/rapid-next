"use client"; // Mark this as a client component

import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}>
        <QueryClientProvider client={queryClient}>
          {/* Background Image */}
          <div className="fixed inset-0 -z-10">
            <Image
              src={"/images/body-background.webp"}
              alt="Background"
              fill
              priority
              className="object-cover"
              quality={100}
            />
          </div>

          {/* Main Content */}
          <div className="relative z-0">{children}</div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
