import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDashboardPosts } from "../../services/dashboardService";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const useDashboardPosts = () => {
  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();

  const pageNumber = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("search") || "";
  const filterStatus = searchParams.get("status") || "";

  const { data, isFetching } = useQuery({
    queryKey: ["dashboard-posts", pageNumber, searchTerm, filterStatus],
    queryFn: () => fetchDashboardPosts(pageNumber, searchTerm, filterStatus),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60, // cache pages for 1 minute
    retry: 0,
    refetchOnWindowFocus: true,
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
