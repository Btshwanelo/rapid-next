import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const setAuthData = (token: string, user: User) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  Cookies.set("token", token, { expires: 7, path: "/", secure: false, sameSite: "strict" });
};

const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  Cookies.remove("token", { path: "/" });
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      setAuthData(token, user);
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
    },
    register: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      setAuthData(token, user);
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      clearAuthData();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    restoreSession: (state) => {
      let token = localStorage.getItem("token") || Cookies.get("token") || null;
      let userStr = localStorage.getItem("user");
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.user = user;
          state.token = token;
          state.isAuthenticated = true;
          Cookies.set("token", token, { expires: 7, path: "/", secure: false, sameSite: "strict" });
        } catch (error) {
          console.error("Failed to parse user data:", error);
          clearAuthData();
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      }
    },
  },
});

export const { login, register, logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
