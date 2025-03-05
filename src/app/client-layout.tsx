"use client"; // Mark this as a client component

import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import store, { persistor } from "@/store";
import { Toaster } from "sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
          <div className="relative z-0">
          <Toaster />
            {children}</div>
          </PersistGate>
          </Provider>
      </body>
    </html>
  );
}
