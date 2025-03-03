import { create } from "zustand";
import { devtools } from "zustand/middleware";
import Cookies from 'js-cookie'; // You'll need to install this: npm install js-cookie

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  register: (user: User, token: string) => void;
  logout: () => void;
  restoreSession: () => void;
};

// Helper function to set token in both localStorage and cookies
const setAuthData = (token: string, user: User) => {
  // Set in localStorage (for client-side access)
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  
  // Set in cookies (for middleware access)
  // 7 days expiry by default, path=/ means available across all pages
  // Cookies.set("token", token, { expires: 7, path: '/' });
  Cookies.set("token", token, { 
    expires: 7,       // 7 days
    path: '/',        // Available across all pages
    secure: false,     // HTTPS only
    sameSite: 'strict' // Cross-site request protection
  });
};

// Helper function to clear auth data from both localStorage and cookies
const clearAuthData = () => {
  // Clear from localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  
  // Clear from cookies
  Cookies.remove("token", { path: '/' });
};

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    login: (user, token) => {
      setAuthData(token, user);
      set({ user, token, isAuthenticated: true }, false, "auth/login");
    },

    register: (user, token) => {
      setAuthData(token, user);
      set({ user, token, isAuthenticated: true }, false, "auth/register");
    },

    logout: () => {
      clearAuthData();
      set({ user: null, token: null, isAuthenticated: false }, false, "auth/logout");
    },

    restoreSession: () => {
      // First try to get from localStorage
      let token = localStorage.getItem("token");
      let userStr = localStorage.getItem("user");
      
      // If not in localStorage, try to get from cookies
      if (!token) {
        token = Cookies.get("token") || null;
      }
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isAuthenticated: true }, false, "auth/restoreSession");
          
          // Ensure cookie is set (in case we restored from localStorage only)
          Cookies.set("token", token, { 
            expires: 7,       // 7 days
            path: '/',        // Available across all pages
            secure: false,     // HTTPS only
            sameSite: 'strict' // Cross-site request protection
          });
        } catch (e) {
          // Handle JSON parse error
          console.error("Failed to parse user data:", e);
          clearAuthData();
        }
      }
    },
  }), { name: "AuthStore" })
);