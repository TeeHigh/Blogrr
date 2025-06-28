import { useQuery } from "@tanstack/react-query";
import { getBlogById } from "../services/apiBlogs";

export function useGetBlogById(blogId) {
  const {data: blogData, isLoading: isLoadingBlogData} = useQuery({
    queryKey: ["blog", blogId],
    queryFn: () => getBlogById(blogId),
  })

  return {
    blogData,
    isLoadingBlogData,
  };
}