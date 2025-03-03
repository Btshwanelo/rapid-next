// app/(dashboard)/layout.tsx
'use client';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { logout } from "@/slices/authSlice";
import { LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

   const router = useRouter();
  const dispatch = useDispatch()

  return (
    <div className="min-h-screen container mx-auto">
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
      {/* Top Navigation */}
      <header className="h-16 flex items-center px-6">
      <div className="mr-auto">
        <Link href={'/dashboard'} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg" />
          <span className="text-white font-bold">Rapid Code</span>
        </Link>
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
                        console.log("Logging out...");
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

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {children}
      </main>
    </div>
  );
}