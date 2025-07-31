import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllBlogsApi,
  getPublishedBlogsApi,
  getBlogByIdApi,
  createBlogApi,
  deleteBlogApi,
} from "../services/blogService";
import toast from "react-hot-toast";
import { BlogPost } from "../types/types";
import { useState } from "react";

export const useBlog = () => {
  const queryClient = useQueryClient();
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);

  // 🔍 Queries
  const useBlogs = () =>
    useQuery<BlogPost[]>({
      queryKey: ["blogs"],
      queryFn: getAllBlogsApi,
    });

  const usePublishedBlogs = () =>
    useQuery<BlogPost[]>({
      queryKey: ["publishedBlogs"],
      queryFn: getPublishedBlogsApi,
    });

  const useSingleBlog = (id: string) =>
    useQuery<BlogPost>({
      queryKey: ["blogs", id],
      queryFn: () => getBlogByIdApi(id),
    });

  // 🛠️ Mutations
  const useCreateBlog = () =>
    useMutation({
      mutationFn: async (data: Omit<BlogPost, "author_avatar" | "id">) => {
        return await toast.promise(createBlogApi(data), {
          loading: "Creating blog",
          success: "Blog created successfully!",
          error: "Error creating blog!",
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["blogs"] });
      },
      onError: (err) => console.error("Failed to create blog", err),
    });

  const useDeleteBlog = () =>
    useMutation({
      mutationFn: deleteBlogApi,
      onSuccess: () => {
        toast.success("Blog deleted");
        queryClient.invalidateQueries({ queryKey: ["blogs"] });
      },
      onError: () => toast.error("Failed to delete blog"),
    });

  return {
    authorPosts,
    setAuthorPosts,
    useBlogs,
    usePublishedBlogs,
    useSingleBlog,
    useCreateBlog,
    useDeleteBlog,
  };
};
