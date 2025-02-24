'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Copy } from "lucide-react";
import Link from 'next/link';


interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Lifebook',
    subtitle: 'Project 1',
    description: 'A solution to give everyone a strategy for their lives',
    imageUrl: 'https://placehold.co/600x400.png'
  },
  {
    id: 2,
    title: 'Coffee Shop App',
    subtitle: 'Project 2',
    description: 'Coffee shop app used by coffee shops as a way to collect orders from customers.',
    imageUrl: 'https://placehold.co/600x400.png'
  },
  {
    id: 3,
    title: 'Richard Test',
    subtitle: 'Project 3',
    description: 'Credit application',
    imageUrl: 'https://placehold.co/600x400.png'
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <Link href={'/project/new'} >
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
        </Link>
      </div>

      {/* Welcome Card */}
      

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-r  from-blue-600 to-blue-400 border-none " style={{ backgroundImage: `url('/images/welcome-profile.png')` }}>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Welcome Back Mish</h2>
            <p className="text-blue-100">Nice to see you</p>
            {/* <Button variant="secondary" className="mt-4 bg-white/10 text-white hover:bg-white/20">
              Start <ArrowRight className="ml-2 h-4 w-4" />
            </Button> */}
          </div>
        </CardContent>
      </Card>
        <Card className="bg-[#0f0f43] border-none">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl text-white">New Ideas</p>
                <h3 className="text-2xl font-bold text-white">+347</h3>
              </div>
              <Button size="icon" variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                <Copy className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Add more stat cards as needed */}
      </div>

      {/* Projects Section */}
      <div className="space-y-6">
        {/* <h2 className="text-xl font-semibold text-white">Projects</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-[#0f0f43] border-none overflow-hidden group">
              <div className="relative aspect-video">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-400">{project.subtitle}</p>
                <h3 className="text-lg font-semibold text-white mt-1">{project.title}</h3>
                <p className="text-sm text-gray-400 mt-2">{project.description}</p>
                <Link href={'/problem-statement'}>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full mt-4"
                >
                  VIEW
                </Button>
                  </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}