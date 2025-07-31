import { useMutation } from "@tanstack/react-query"
import { createBlogApi } from "../../services/blogService";
import toast from "react-hot-toast";
import { BlogPost } from "../../types/types";

export default function useCreateBlog(){
  const {mutate: addPost, data, isPending: isCreatingBlog} = useMutation({
    mutationFn: async (data: Omit<BlogPost, "author_avatar" | "id">) => {
      return await toast.promise(createBlogApi(data), {
        loading: "Creating blog",
        success: "Blog created successfully!",
        error: "Error creating blog!",
      })
    },
    onSuccess: () => {
      console.log("Blog has been created");
    },
    onError: (error) => {
      console.error(error.message);
    }
  });
  return {
    addPost,
    isCreatingBlog,
    data
  }
}