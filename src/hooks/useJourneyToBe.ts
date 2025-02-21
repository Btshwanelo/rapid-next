import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "../store/userStore";

const PROD_BASE_URL = 'http://172.172.166.174:5002';

const fetchUser = async () => {
  const res = await fetch(`${PROD_BASE_URL}/api/user`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

export const useUser = () => {
  const { setUser } = useUserStore();
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const user = await fetchUser();
      setUser(user); // Update Zustand store
      return user;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
