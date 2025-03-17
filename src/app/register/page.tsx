'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRegisterUserMutation } from '@/services/authService';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useDispatch } from 'react-redux';
import { register } from '@/slices/authSlice';

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const RegisterPage = () => {
  const router = useRouter();
  const dispatch = useDispatch()
  const [registerUser, registerProps] = useRegisterUserMutation();
  console.log("registerProps",registerProps)
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    registerUser({ 
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: 'user' 
    });
  };
  
  // Handle successful registration
  useEffect(() => {
    if (registerProps.isSuccess) {
      dispatch(register({user:registerProps.data.user,token:registerProps.data.token}))
      router.push('/dashboard');
    }
  }, [registerProps.isSuccess, router]);
  
  // Parse error message from RTK query response
  const getErrorMessage = () => {
    if (!registerProps.error) return null;
    
    if ('data' in registerProps.error) {
      return  'Registration failed. Please try again.';
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
              <AlertDescription className=''>
                {errorMessage}
                <Button 
                  variant="link" 
                  className="text-red-200 p-0 ml-6 h-auto" 
                  onClick={() => registerProps.reset()}
                >
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <CardHeader>
            <h2 className="text-2xl font-semibold text-white mb-2">Nice to see you!</h2>
            <p className="text-gray-400 text-sm">
              Enter your details to create your account
            </p>
          </CardHeader>
          
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={`bg-gray-900 border-gray-800 text-white ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              
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
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-200">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`bg-gray-900 border-gray-800 text-white ${errors.confirmPassword ? 'border-red-500' : ''}`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                disabled={registerProps.isLoading}
              >
                {registerProps.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    SIGNING UP...
                  </>
                ) : (
                  "SIGN UP"
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-400">
                Already have an account?{' '}
                <a href="/login" className="text-blue-500 hover:text-blue-400">
                  Sign in
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

export default RegisterPage;