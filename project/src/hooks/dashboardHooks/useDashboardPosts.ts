import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDashboardPosts } from "../../services/dashboardService";
import { useEffect } from "react";
import { paginationConstants } from "../../constants/paginationConstants";

const useDashboardPosts = () => {
  const queryClient = useQueryClient();

  const { pageNumber, searchTerm, filterStatus } = paginationConstants;

  const { data, isFetching } = useQuery({
    queryKey: ["dashboard-posts", pageNumber, searchTerm, filterStatus],
    queryFn: () => fetchDashboardPosts(pageNumber, searchTerm, filterStatus),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60, // cache pages for 1 minute
    retry: 0,
    refetchOnWindowFocus: false,
  });

  // Prefetch next and prev pages when data arrives
  useEffect(() => {
    if (data?.next) {
      queryClient.prefetchQuery({
        queryKey: ["dashboard-posts", pageNumber + 1, searchTerm, filterStatus],
        queryFn: () =>
          fetchDashboardPosts(pageNumber + 1, searchTerm, filterStatus),
      });
    }

    if (data?.previous) {
      queryClient.prefetchQuery({
        queryKey: ["dashboard-posts", pageNumber - 1, searchTerm, filterStatus],
        queryFn: () =>
          fetchDashboardPosts(pageNumber - 1, searchTerm, filterStatus),
      });
    }
  }, [data, pageNumber, searchTerm, filterStatus, queryClient]);

  return {
    data,
    isFetching,
  };
};

export default useDashboardPosts;
