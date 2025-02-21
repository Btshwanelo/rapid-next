// app/(dashboard)/layout.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen container">
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
      {/* Top Navigation */}
      <header className="h-16 flex items-center px-6">
      <div className="mr-auto">
        <Link href={'/dashboard'} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg" />
          <span className="text-white font-bold">Rapid Code</span>
        </Link>
      </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {children}
      </main>
    </div>
  );
}