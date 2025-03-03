'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLoginUserMutation } from '@/services/authService';
import { useDispatch } from 'react-redux';
import { register } from '@/slices/authSlice';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

type FormData = {
  email: string;
  password: string;
}

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
}

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginUser, loginProps] = useLoginUserMutation();
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  
  // Form validation errors
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error when field is edited
    if (errors[id as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    loginUser({ 
      email: formData.email,
      password: formData.password
    });
  };
  
  // Handle successful login
  useEffect(() => {
    if (loginProps.isSuccess && loginProps.data) {
      dispatch(register({
        user: loginProps.data.user,
        token: loginProps.data.token
      }));
      router.push('/dashboard');
    }
  }, [loginProps.isSuccess, loginProps.data, dispatch, router]);
  
  // Parse error message from RTK query response
  const getErrorMessage = () => {
    if (!loginProps.error) return null;
    
    if ('data' in loginProps.error) {
      return loginProps.error.data?.message || 'Login failed. Please check your credentials.';
    }
    
    return 'Network error. Please check your connection and try again.';
  };
  
  const errorMessage = getErrorMessage();

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left side - Hero Image */}
      <div className="w-full lg:w-1/2 p-6 lg:p-12 relative flex flex-col justify-center align-middle overflow-hidden">
        <Image
          src={'/images/background-cover-auth-signin.webp'}
          alt="Background"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        <div className="relative z-10 space-y-10">
          <div className="text-xs text-white mb-4">RAPID CODE AI</div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl text-white font-bold mb-2">
            WELCOME TO RAPID CODE AI
          </h1>
          <p className="text-white text-sm md:text-base">
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
      <div className="w-full lg:w-1/2 bg-[#0f0f43] flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md bg-[#0f0f43] border-none border-gray-800">
          {errorMessage && (
            <Alert variant="destructive" className="mb-4 bg-red-900/30 border border-red-800 text-red-200">
              <AlertDescription>
                {errorMessage}
                <Button 
                  variant="link" 
                  className="text-red-200 p-0 ml-2 h-auto" 
                  onClick={() => loginProps.reset()}
                >
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <CardHeader>
            <h2 className="text-2xl font-semibold text-white mb-2">Nice to see you!</h2>
            <p className="text-gray-400 text-sm">
              Enter your email and password to sign in
            </p>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`bg-gray-900 border-gray-800 text-white ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`bg-gray-900 border-gray-800 text-white ${errors.password ? 'border-red-500' : ''}`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="remember" className="text-gray-300 text-sm">
                    Remember me
                  </Label>
                </div>
                
                <a href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-400">
                  Forgot password?
                </a>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                disabled={loginProps.isLoading}
              >
                {loginProps.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    SIGNING IN...
                  </>
                ) : (
                  "SIGN IN"
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <a href="/register" className="text-blue-500 hover:text-blue-400">
                  Sign up
                </a>
              </div>
            </CardFooter>
          </form>
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