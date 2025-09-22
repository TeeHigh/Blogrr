import { useQuery } from "@tanstack/react-query";
import { fetchDashboardPosts } from "../../services/dashboardService";

const useDashboardPosts = (pageNumber: number, searchTerm: string, filterStatus: string) => {
  
  const { data, isFetching } = useQuery({
    queryKey: ["dashboard-posts", pageNumber, searchTerm, filterStatus],
    queryFn: () => fetchDashboardPosts(pageNumber, searchTerm, filterStatus),
    retry: 0,
    refetchOnWindowFocus: true,
  });

  return {
    data,
    isFetching,
  };
}

export default useDashboardPosts;