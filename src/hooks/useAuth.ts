import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";

const PROD_BASE_URL = "http://172.172.166.174:5002/api/v2/auth";

// API Calls
const registerUser = async (data: { name: string; email: string; password: string }) => {
  const res = await fetch(`${PROD_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to register user");
  return res.json();
};

const loginUser = async (data: { email: string; password: string }) => {
  const res = await fetch(`${PROD_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Invalid email or password");
  return res.json();
};

// useAuth Hook
export const useAuth = () => {
  const { login, logout } = useAuthStore();
  const queryClient = useQueryClient();

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      login(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => console.error("Register Error:", error),
  });

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => console.error("Login Error:", error),
  });

  // Logout Function
  const handleLogout = () => {
    logout();
    queryClient.clear(); // Clear cache when logging out
  };

  return {
    register: registerMutation.mutate,
    login: loginMutation.mutate,
    logout: handleLogout,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
  };
};
