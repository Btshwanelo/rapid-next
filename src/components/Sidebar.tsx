'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  Users,
  FileText,
  Heart,
  Target,
  Map,
  BrainCircuit,
  BarChart3,
  Film,
  Workflow,
  Menu,
  Settings,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define menu items as a separate constant
const MENU_ITEMS = [
  { icon: FileText, label: 'Problem Statement', url: '/problem-statement' },
  { icon: Users, label: 'Personas', url: '/personas' },
  { icon: Heart, label: 'Empathy As Is', url: '/empathy-as-is' },
  { icon: Target, label: 'Empathy To Be', url: '/empathy-to-be' },
  { icon: FileText, label: 'Needs Statement', url: '/needs' },
  { icon: Map, label: 'Journey As Is', url: '/journey-as-is' },
  { icon: Workflow, label: 'Journey To Be', url: '/journey-to-be' },
  { icon: BrainCircuit, label: 'Big Ideas', url: '/ideas' },
  { icon: LayoutGrid, label: 'Prioritization Grid', url: '/prioritization' },
  { icon: Film, label: 'Storyboarding', url: '/storyboarding' },
  { icon: BarChart3, label: 'Experience Map', url: '/experience-map' },
] as const;

// Create a separate Sidebar component
export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#0A0A29] min-h-full  rounded-xl mx-4  flex flex-col">
      {/* Logo */}
      <div className="py-6 px-6 mb-10">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg" />
          <span className="text-white font-bold">Rapid Code</span>
        </Link>
      </div>

      {/* Project Selector */}
    

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.url;
          
          return (
            <Link 
              key={item.url} 
              href={item.url}
              className="block"
            >
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start transition-colors font-semibold",
                  isActive 
                    ? "bg-blue-600 text-white hover:bg-blue-800 hover:text-white" 
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                <item.icon className={cn("mr-2 ", isActive?'text-white':'text-blue-700')}  />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Help Section */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-4">
          <h3 className="text-white  mb-2 font-semibold">Need help?</h3>
          <p className="text-gray-300 text-sm mb-4 font-semibold">Please check our docs</p>
          <Button 
            variant="secondary" 
            size={'sm'}
            className="w-full bg-[#0A0A29] text-sm text-white hover:bg-gray-800"
          >
            DOCUMENTATION
          </Button>
        </div>
      </div>
    </div>
  );
};