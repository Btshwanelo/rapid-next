import { create } from "zustand";

type DashboardData = {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture: string;
  skills: string[];
  createdAt: string;
};

type DashboardStore = {
  dashboardData: DashboardData | null;
  setDashboardData: (data: DashboardData) => void;
  clearDashboardData: () => void;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  dashboardData: null,

  setDashboardData: (data) => set({ dashboardData: data }),

  clearDashboardData: () => set({ dashboardData: null }),
}));
