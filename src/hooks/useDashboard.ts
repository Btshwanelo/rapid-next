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

// API Fetch Function with Authorization Header
const fetchDashboardData = async (): Promise<DashboardData> => {
  const token = localStorage.getItem("token"); // Retrieve token from storage
  if (!token) throw new Error("No auth token found. Please log in.");

  const res = await fetch(`${PROD_BASE_URL}/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Add authorization token
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch dashboard data");
  }

  const result = await res.json();
  return result.data;
};

// useDashboard Hook
export const useDashboard = () => {
  const { setDashboardData, clearDashboardData } = useDashboardStore();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch, error } = useQuery<DashboardData, Error>({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    onSuccess: (data:any) => {
      setDashboardData(data);
    },
    onError: (err:any) => {
      console.error("Error fetching dashboard:", err.message);
      clearDashboardData();
    },
  });

  return { data, isLoading, isError, error, refetch };
};
