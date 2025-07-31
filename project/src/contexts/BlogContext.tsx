import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  getAllBlogsApi,
  getPublishedBlogsApi,
  getBlogByIdApi,
  createBlogApi,
  deleteBlogApi,
} from "../services/blogService";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { BlogPost } from "../types/types";
// import useCreateBlog from "../hooks/blogHooks/useCreateBlog";

type BlogContextType = {
  authorPosts: BlogPost[];
  setAuthorPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  useBlogs: () => ReturnType<typeof useQuery<BlogPost[]>>;
  usePublishedBlogs: () => ReturnType<typeof useQuery<BlogPost[]>>;
  useSingleBlog: (id: string) => ReturnType<typeof useQuery<BlogPost>>;
  useCreateBlog: () => UseMutationResult<
    void, // What the mutation returns
    Error, // Error type
    Omit<BlogPost, "author_avatar" | "id">, // What mutate(data) expects
    unknown // Context (usually unknown unless doing optimistic updates)
  >;
  useDeleteBlog: () => ReturnType<typeof useMutation<void, Error, string>>;
};

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [authorPosts, setAuthorPosts] = useState<BlogPost[]>([]);

  // Queries
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

  // Mutations
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
      mutationFn: async (id: string) => {
        return await toast.promise(deleteBlogApi(id), {
          loading: "Deleting blog",
          success: "Blog deleted",
          error: "Failed to delete blog"
        })
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["blogs"] });
      },
      onError: (err) => console.error(err),
    });

  return (
    <BlogContext.Provider
      value={{
        authorPosts,
        setAuthorPosts,
        useBlogs,
        usePublishedBlogs,
        useSingleBlog,
        useCreateBlog,
        useDeleteBlog,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

// Custom hook to access blog context
export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlogContext must be used within a BlogProvider");
  }
  return context;
};
