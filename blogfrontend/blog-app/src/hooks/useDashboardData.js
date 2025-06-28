import { useQuery } from "@tanstack/react-query";
import { getBlogs, getDashboardData } from "../services/apiBlogs";

export function useDashboardData(){
  const {data: dashboardData, isLoading: isLoadingDashboardData} = useQuery({
    queryFn: getDashboardData,
    queryKey: ['dashboard'],
  });

  return {
    dashboardData,
    isLoadingDashboardData,
  };
}