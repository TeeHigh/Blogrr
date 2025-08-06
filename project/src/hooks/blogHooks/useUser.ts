import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../../services/fetchDashboardData";

export default function useUser(){
  const { data, isPending, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: 1,
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