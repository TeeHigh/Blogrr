import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../../services/fetchDashboardData";
import api from "../../api";

export default function useUser(){
  const { data, isPending, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get("/api/dashboard/");
      return res.data;
    },
    // retry: 1,
  });

  if (error) {
    console.error("Error fetching user data:", error);
  }

  return {
    data,
    isPending,
    error
  };
}