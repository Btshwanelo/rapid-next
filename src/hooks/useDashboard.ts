import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDashboardStore } from "../store/dashboardStore";

const PROD_BASE_URL = "http://172.172.166.174:5002/api/v2";

// Define API response type
type DashboardData = {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture: string;
  skills: string[];
  createdAt: string;
};

// API Fetch Function
const fetchDashboardData = async (): Promise<DashboardData> => {
  const res = await fetch(`${PROD_BASE_URL}/me`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch dashboard data");

  const result = await res.json();
  return result.data;
};

// useDashboard Hook
export const useDashboard = () => {
  const { setDashboardData, clearDashboardData } = useDashboardStore();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery<DashboardData, Error>({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    onSuccess: (data) => {
      setDashboardData(data);
    },
    onError: () => {
      clearDashboardData();
    },
  });

  return { data, isLoading, isError, refetch };
};
