import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "../../types/types";
import { getBlogByIdApi } from "../../services/blogService";
import { queryKeys } from "../../constants/queryKeys";

function useSingleBlog(id: string){

  const { data, isPending, error } = useQuery<BlogPost>({
    queryKey: queryKeys.blog(id),
    queryFn: () => getBlogByIdApi(id),
    enabled: !!id, // Only run the query if id is provided
    retry: 1,
  });

  return {
    data,
    isPending,
    error,
  };

}

export default useSingleBlog;