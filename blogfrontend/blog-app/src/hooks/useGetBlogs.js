import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "../services/apiBlogs";

export function useGetBlogs(){
  const {data: blogsData, isLoading: isLoadingBlogs} = useQuery({
    queryFn: getBlogs,
    queryKey: ['blogs'],
  });

  return {
    blogsData,
    isLoadingBlogs,
  };
}