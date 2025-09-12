import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../../services/fetchDashboardData";

export default function useUser(){
  const { data, isPending, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: 1,
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