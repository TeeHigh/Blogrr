import { useQuery } from "@tanstack/react-query";
import { getPublishedBlogsApi } from "../../services/blogService";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { BlogPost } from "../../types/types";

export default function useGetPublishedBlogs() {
  const { data: posts, isPending: isFetchingBlogs, error } = useQuery({
    queryKey: ["publishedBlogs"],
    queryFn: getPublishedBlogsApi,
    // onError: () => {
    //   toast.error("Couldn't fetch blogs!");
    // },
  });

  return {
    posts,
    isFetchingBlogs,
    error
  };
}

// <BlogPost[], AxiosError>