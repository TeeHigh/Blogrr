import { useQuery } from "@tanstack/react-query";
import { getPublishedBlogsApi } from "../../services/blogService";
import { queryKeys } from "../../constants/queryKeys";

export default function useGetPublishedBlogs() {
  const { data: posts, isPending: isFetchingBlogs, error } = useQuery({
    queryKey: queryKeys.publishedBlogs,
    queryFn: getPublishedBlogsApi,
  });

  return {
    posts,
    isFetchingBlogs,
    error
  };
}

// <BlogPost[], AxiosError>