import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlogApi } from "../../services/blogService";
import toast from "react-hot-toast";
import { BlogPost } from "../../types/types";
import { queryKeys } from "../../constants/queryKeys";

export default function useCreateBlog() {
  const queryClient = useQueryClient();

  const {
    mutate: addPost,
    data,
    isPending: isCreatingBlog,
  } = useMutation({
    mutationFn: async (data: Omit<BlogPost, "author_avatar" | "id">) => {
      return await toast.promise(createBlogApi(data), {
        loading: "Creating blog",
        success: "Blog created successfully!",
        error: "Error creating blog!",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs });
      queryClient.invalidateQueries({ queryKey: queryKeys.publishedBlogs });
    },
    onError: (error) => {
      console.error(error.message);
    },
  });
  return {
    addPost,
    isCreatingBlog,
    data,
  };
}
