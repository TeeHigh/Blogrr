import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBlogApi } from "../../services/blogService";
import toast from "react-hot-toast";
import { BlogPost } from "../../types/types";
import { queryKeys } from "../../constants/queryKeys";

type UpdateBlogInput = {
  id: string;
  post: Partial<BlogPost>;
};

export default function useUpdateBlog() {
  const queryClient = useQueryClient();

  const {
    mutate: updatePost,
    data,
    isPending: isUpdatingBlog,
  } = useMutation<void, Error, UpdateBlogInput>({
    mutationFn: async ({ id, post }) => {
      return await toast.promise(updateBlogApi(id, post), {
        loading: "Updating blog",
        success: "Blog updated successfully!",
        error: "Error updating blog!",
      });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashPosts, refetchType: "active" });
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs, refetchType: "active" });
      queryClient.invalidateQueries({ queryKey: queryKeys.publishedBlogs , refetchType: "active"});
      queryClient.invalidateQueries({ queryKey: queryKeys.blog(id), refetchType: "active" });
      queryClient.invalidateQueries({ queryKey: queryKeys.blog(id), refetchType: "active" });
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  return {
    updatePost,
    isUpdatingBlog,
    data,
  };
}
