'use client'
import "../globals.css";
import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User, Settings } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/slices/authSlice";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const dispatch = useDispatch()
  const router = useRouter();

  return (

    <div>
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
        </div>

        <div className="min-h-screen flex relative z-0">
          {/* Sidebar with glass effect */}
          <div className="relative">
            <div className="" />
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col px-6 pt-4 ">
            {/* Top Navigation with glass effect */}
            <header className="h-16 flex items-center justify-between px-6 relative">
              <div className="absolute inset-0 bg-[#0A0A29]/30 rounded-xl backdrop-blur-sm -z-10" />
              <div className="flex items-center z-10">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 z-10">
                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#0A0A29]/90 backdrop-blur-sm border-gray-800 text-white">
                    <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                      <Link href="/profile" className="flex items-center w-full">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                      <Link href="/settings" className="flex items-center w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem 
                      className="hover:bg-white/10 text-red-400 cursor-pointer"
                      onClick={() => {
                        // Add your logout logic here
                        dispatch(logout())
                        router.push('/login');
                        // Example: router.push('/auth/login');
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto pt-6">
              {/* Content wrapper with glass effect */}
              <div className="relative rounded-lg">
                <div className="absolute inset-0 bg-[#0A0A29]/30 backdrop-blur-sm -z-10 rounded-lg" />
                <div className="relative z-0">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
    </div>
  );
}