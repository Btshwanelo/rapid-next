'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";

// API URL Configuration
// Consider moving this to an environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:3002/api/v2/auth";

// Types
type RegisterData = { 
  name: string; 
  email: string; 
  password: string;
  role: string;
};

type LoginData = { 
  email: string; 
  password: string;
};

type AuthError = {
  message: string;
  statusCode?: number;
};

// API Calls with better error handling
const registerUser = async (data: RegisterData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      // Add timeout control
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    });
    
    // Handle HTTP error responses
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw {
        message: errorData.message || "Failed to register user",
        statusCode: res.status
      };
    }
    
    return res.json();
  } catch (error) {
    // Handle network errors and timeouts
    if (error instanceof DOMException && error.name === "AbortError") {
      throw { message: "Request timeout. Please try again." };
    }
    
    // Re-throw the error to be handled by the mutation
    throw error instanceof Error 
      ? { message: error.message }
      : error;
  }
};

const loginUser = async (data: LoginData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      // Add timeout control
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    });
    
    // Handle HTTP error responses
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw {
        message: errorData.message || "Invalid email or password",
        statusCode: res.status
      };
    }
    
    return res.json();
  } catch (error) {
    // Handle network errors and timeouts
    if (error instanceof DOMException && error.name === "AbortError") {
      throw { message: "Request timeout. Please try again." };
    }
    
    // Re-throw the error to be handled by the mutation
    throw error instanceof Error 
      ? { message: error.message }
      : error;
  }
};

// Define the return type for the hook
type UseAuthReturn = {
  register: (data: RegisterData) => void;
  login: (data: LoginData) => void;
  logout: () => void;
  isRegistering: boolean;
  isLoggingIn: boolean;
  error: string | null;
  clearError: () => void;
};

// Improved useAuth Hook
export const useAuth = (): UseAuthReturn => {
  const { login, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [authError, setAuthError] = useState<string | null>(null);

  // Clear error when starting a new request
  const clearError = () => setAuthError(null);

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (data.user && data.token) {
        login(data.user, data.token);
        queryClient.invalidateQueries({ queryKey: ["auth"] });
        clearError();
      } else {
        setAuthError("Registration successful but received invalid user data");
      }
    },
    onError: (error: AuthError) => {
      console.error("Register Error:", error);
      setAuthError(error.message || "Failed to register. Please try again.");
    },
  });

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.user && data.token) {
        login(data.user, data.token);
        queryClient.invalidateQueries({ queryKey: ["auth"] });
        clearError();
      } else {
        setAuthError("Login successful but received invalid user data");
      }
    },
    onError: (error: AuthError) => {
      console.error("Login Error:", error);
      setAuthError(error.message || "Failed to login. Please try again.");
    },
  });

  // Logout Function
  const handleLogout = () => {
    logout();
    queryClient.clear(); // Clear cache when logging out
    clearError();
  };

  return {
    register: (data: RegisterData) => {
      clearError();
      registerMutation.mutate(data);
    },
    login: (data: LoginData) => {
      clearError();
      loginMutation.mutate(data);
    },
    logout: handleLogout,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    error: authError,
    clearError,
  } as UseAuthReturn;
};

