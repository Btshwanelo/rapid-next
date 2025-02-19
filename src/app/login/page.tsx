import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const LoginPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left side - Hero Image */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 p-6 lg:p-12 relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-xs text-white/80 mb-4">RAPID CODE AI</div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl text-white font-bold max-w-2xl mb-2">
            WELCOME TO RAPID CODE AI
          </h1>
          <p className="text-white/80 text-sm md:text-base">
            IDEATION TO IMPLEMENTATION, SIMPLIFIED
          </p>
        </div>
        
        {/* Abstract geometric pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/50">
          <div className="absolute inset-0 opacity-30">
            {/* You can add more geometric patterns here */}
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 bg-gray-950 flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md bg-gray-950 border-gray-800">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-white mb-2">Nice to see you!</h2>
            <p className="text-gray-400 text-sm">
              Enter your email and password to sign in
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-gray-900 border-gray-800 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="bg-gray-900 border-gray-800 text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="remember" className="data-[state=checked]:bg-blue-600" />
              <Label htmlFor="remember" className="text-gray-200">
                Remember me
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              SIGN IN
            </Button>
            
            <div className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <a href="#" className="text-blue-500 hover:text-blue-400">
                Sign up
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 right-4 text-sm text-gray-400">
        © 2025 Rapid Labs •{' '}
        <a href="#" className="hover:text-gray-300">Terms</a> •{' '}
        <a href="#" className="hover:text-gray-300">Blog</a> •{' '}
        <a href="#" className="hover:text-gray-300">License</a>
      </div>
    </div>
  );
};

export default LoginPage;