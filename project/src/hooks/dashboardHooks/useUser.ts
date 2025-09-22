import { useQuery } from "@tanstack/react-query";
import { fetchUserDashboard } from "../../services/dashboardService";

export default function useUser(){
  const { data, isPending, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserDashboard,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  if (error) {
    console.error("Error fetching user data:", error);
    // window.location.href = "/login";
  }

  return {
    data,
    isPending,
    error
  };
}